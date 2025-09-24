// Define la interfaz para datos genéricos de recetas
export interface PrescriptionData {
  centro?: string;
  paciente?: { nombre: string };
  obraSocial?: string;
  numeroObraSocial?: string;
  prescripcion?: {
    OD?: { esfera?: string; cilindro?: string; eje?: string };
    OI?: { esfera?: string; cilindro?: string; eje?: string };
  };
  fecha?: string;
  otrosDatos?: { [key: string]: string }; // Para datos adicionales no estructurados
}