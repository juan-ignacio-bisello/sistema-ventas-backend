export interface EyeData {
  raw: string;
  esf?: string | null;
  cil?: string | null;
  eje?: string | null;
  add?: string | null;
}

export interface PrescriptionParsed {
  od: EyeData | null;
  oi: EyeData | null;
  observaciones: string | null;
  rawLines?: string[]; // opcional para debug
}
