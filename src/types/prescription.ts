export interface EyeData {
  raw: string;
  esf: string | null;
  cil: string | null;
  eje: string | null;
}

export interface PrescriptionParsed {
  paciente: string | null;
  od: EyeData | null;
  oi: EyeData | null;
  observaciones: string | null;
}
