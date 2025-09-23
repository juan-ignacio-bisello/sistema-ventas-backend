import { PrescriptionParsed, EyeData } from "../types/prescription";

function normalizeLineForOCR(l: string): string {
  return l
    .replace(/×/g, "x")
    .replace(/\s+/g, " ")
    .replace(/\b0D\b/ig, "OD")
    .replace(/\b0I\b/ig, "OI")
    .replace(/\bO\s*D\b/ig, "OD")
    .replace(/\bO\s*I\b/ig, "OI")
    .trim();
}

export function parsePrescription(text: string): PrescriptionParsed {
  const rawLines = text.split(/\r?\n/).map(l => l.trim());
  const lines = rawLines.map(normalizeLineForOCR).filter(Boolean);

  const fullText = lines.join("\n");

  // ADD global
  const globalAdd = fullText.match(/(?:\badd\b|adici[oó]n|adición)[:\s]*([+-]?\d+(?:\.\d+)?)/i)?.[1] ?? null;

  const signatureRegex = /^(Firma|Dr\.?|Dra\.?|Médico|Mat[rí]cula|Lic\.|Especialista)\b/i;

  function findEyeIndex(tagRegex: RegExp) {
    for (let i = 0; i < lines.length; i++) {
      if (tagRegex.test(lines[i] ?? '')) return i;
    }
    return -1;
  }

  const odTagRegex = /\b(?:OD|O\.D\.|0D)\b/i;
  const oiTagRegex = /\b(?:OI|OS|O\.I\.|O\.S\.|0I|0S)\b/i;

  const odIndex = findEyeIndex(odTagRegex);
  const oiIndex = findEyeIndex(oiTagRegex);

  function contentAfterTag(line: string, tagRegex: RegExp, nextLine?: string): string {
    const after = line.replace(new RegExp(`.*${tagRegex.source}`, "i"), "").trim();
    if (after) return after;
    return (nextLine || "").trim();
  }

  function parseEyeTxt(txt: string): Partial<EyeData> {
    const out: Partial<EyeData> = { raw: txt.trim() };
    if (!txt) return out;

    const addMatch = txt.match(/(?:\badd\b|adici[oó]n|adición)[:\s]*([+-]?\d+(?:\.\d+)?)/i);
    if (addMatch) out.add = addMatch[1] ?? null;

    const compact = txt.match(/([+-]?\d+(?:\.\d+)?|plano)\s+([+-]?\d+(?:\.\d+)?)(?:\s*[x×]\s*([0-9]{1,3}))?/i);
    if (compact) {
      out.esf = compact[1] && compact[1].toLowerCase() === "plano" ? "plano" : compact[1] ?? null;
      out.cil = compact[2]  ?? null;
      if (compact[3]) out.eje = String(Number(compact[3]));
      return out;
    }

    const cylAxis = txt.match(/([+-]?\d+(?:\.\d+)?)[\s]*[x×][\s]*([0-9]{1,3})/i);
    if (cylAxis) {
      out.cil = cylAxis[1] ?? '';
      out.eje = String(Number(cylAxis[2]));
      const before = txt.slice(0, cylAxis.index);
      const tokens = before.match(/([+-]?\d+(?:\.\d+)?|plano)/gi);
      if (tokens && tokens.length) out.esf = tokens[tokens.length - 1] ?? '';
      return out;
    }

    const esfL = txt.match(/(?:esf(?:era)?|sph)[:\s]*([+-]?\d+(?:\.\d+)?|plano)/i)?.[1];
    const cilL = txt.match(/(?:cil(?:indro)?|cyl)[:\s]*([+-]?\d+(?:\.\d+)?)/i)?.[1];
    const ejeL = txt.match(/(?:eje|axis)[:\s]*([0-9]{1,3})/i)?.[1];
    if (esfL) out.esf = esfL;
    if (cilL) out.cil = cilL;
    if (ejeL) out.eje = String(Number(ejeL));
    if (esfL || cilL || ejeL) return out;

    const tokens = txt.match(/([+-]?\d+(?:\.\d+)?|plano|[0-9]{1,3}°?)/gi)?.map(t => t.replace("°", ""));
    if (tokens && tokens.length) {
      if (!out.esf && tokens[0]) out.esf = tokens[0];
      if (!out.cil && tokens[1]) out.cil = tokens[1];
      if (!out.eje && tokens[2] && /^[0-9]{1,3}$/.test(tokens[2])) out.eje = String(Number(tokens[2]));
    }

    return out;
  }

  function buildEye(i: number): EyeData | null {
    if (i < 0 || i >= lines.length) return null;
    const line = lines[i];
    const nextLine = lines[i + 1];
    const txt = contentAfterTag(line ?? '', /\b(OD|O\.D\.|0D|OI|OS|O\.I\.|O\.S\.|0I|0S)\b/i, nextLine);
    const parsed = parseEyeTxt(txt || "");
    return {
      raw: txt || "",
      esf: parsed.esf ?? null,
      cil: parsed.cil ?? null,
      eje: parsed.eje ?? null,
      add: parsed.add ?? null
    };
  }

  const od = buildEye(odIndex);
  const oi = buildEye(oiIndex);

  if (globalAdd) {
    if (od && !od.add) od.add = globalAdd;
    if (oi && !oi.add) oi.add = globalAdd;
  }

  const eyeIndices = [odIndex, oiIndex].filter(i => i >= 0);
  const lastEyeIndex = eyeIndices.length ? Math.max(...eyeIndices) : -1;

  let observaciones: string | null = null;
  if (lastEyeIndex >= 0) {
    const sigIdx = lines.findIndex((l, idx) => idx > lastEyeIndex && signatureRegex.test(l));
    const obsSlice = sigIdx !== -1 ? lines.slice(lastEyeIndex + 1, sigIdx) : lines.slice(lastEyeIndex + 1);
    const obsText = obsSlice.join(" ").trim();
    if (obsText) observaciones = obsText;
  }

  if (!observaciones) {
    const obsMatch = fullText.match(/observaciones[:\-]?\s*([\s\S]+)/i);
    if (obsMatch) {
      const after = obsMatch[1]?.split(/\r?\n/).map(s => s.trim()).filter(Boolean).join(" ");
      observaciones = after || null;
    }
  }

  return {
    od,
    oi,
    observaciones,
    rawLines
  };
}
