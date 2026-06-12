export type Estado = "QAP" | "A la escucha" | "Monitoreando" | "Móvil" | "Base" | "CW (Morse)";

export type Banda = "HF" | "VHF" | "UHF";

export type UnidadFrecuencia = "kHz" | "MHz" | "GHz";

export interface Disponibilidad {
  id: string;
  indicativo: string;
  numero_operador: string | null;
  frecuencia: string;
  banda: Banda;
  estado: Estado;
  hora_desde: string;
  hora_hasta: string;
  observaciones: string | null;
  fecha_creacion: string;
  fecha_expiracion: string;
}

export interface CreateDisponibilidadInput {
  indicativo: string;
  numero_operador?: string;
  frecuencia: string;
  estado: Estado;
  hora_desde: string;
  hora_hasta: string;
  observaciones?: string;
}

export interface ApiError {
  error: string;
  details?: string;
}