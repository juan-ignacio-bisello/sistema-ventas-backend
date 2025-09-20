import { PrescriptionParsed, EyeData } from "../types/prescription";

export function parsePrescription(text: string): PrescriptionParsed {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const pacienteMatch = lines.join(" ").match(/Paciente[:\-]?\s*(.+)/i);
  const paciente = pacienteMatch?.[1] ?? null;


  function parseEye(eyeTag: string): EyeData | null {
    const regex = new RegExp(`${eyeTag}[:\\-]?\\s*([^\\n]+)`, "i");
    const match = text.match(regex);
    if (!match) return null;

    const txt = match[1];
    if (!txt) return null;
    const esf = txt.match(/([+-]?\d+(?:\.\d+)?|plano)/i)?.[1] || null;
    const cil = txt.match(/([+-]?\d+(?:\.\d+)?)(?=\s*(?:cil|cyl|eje))/i)?.[1] || null;
    const eje = txt.match(/(?:eje|°)[:º]?\s*([0-9]{1,3})/i)?.[1] || null;

    return { raw: txt.trim(), esf, cil, eje };
  }

  const od = parseEye("OD");
  const oi = parseEye("OI") || parseEye("OS");

  const obsMatch = text.match(/Observaciones[:\-]?\s*([\s\S]+)/i);
  const observaciones = obsMatch && typeof obsMatch[1] === "string" ? obsMatch[1].trim() : null;

  return { paciente, od, oi, observaciones };
}
