import type { Banda, Estado, UnidadFrecuencia } from "@/types";

export function validarFrecuencia(frecuencia: string): boolean {
  const regex = /^\d+\.\d+\s+(kHz|MHz|GHz)$/i;
  return regex.test(frecuencia.trim());
}

export function validarNumeroFrecuencia(numero: string): boolean {
  const regex = /^\d+\.?\d*$/;
  return regex.test(numero.trim()) && numero.trim().length > 0;
}

export function validarIndicativo(indicativo: string): boolean {
  const regex = /^[A-Z]{1,2}\d{1}[A-Z]{1,3}$/i;
  return regex.test(indicativo.trim());
}

export function calcularBanda(frecuencia: string): Banda {
  const match = frecuencia.match(/(\d+\.?\d*)\s*(kHz|MHz|GHz)/i);
  if (!match) return "HF";

  const valor = parseFloat(match[1]);
  const unidad = match[2].toLowerCase();

  let mhz = valor;
  if (unidad === "khz") mhz = valor / 1000;
  else if (unidad === "ghz") mhz = valor * 1000;

  if (mhz >= 3 && mhz <= 30) return "HF";
  if (mhz >= 30 && mhz <= 300) return "VHF";
  return "UHF";
}

export function formatoTiempoRelativo(fecha: string): string {
  const ahora = new Date();
  const creado = new Date(fecha);
  const diffMs = ahora.getTime() - creado.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "ahora";
  if (diffMin < 60) return `hace ${diffMin} min`;

  const diffHoras = Math.floor(diffMin / 60);
  if (diffHoras < 24) {
    return `hace ${diffHoras} ${diffHoras === 1 ? "hora" : "horas"}`;
  }

  const diffDias = Math.floor(diffHoras / 24);
  return `hace ${diffDias} ${diffDias === 1 ? "día" : "días"}`;
}

export function colorActividad(fecha: string): "success" | "warning" | "muted" {
  const ahora = new Date();
  const creado = new Date(fecha);
  const diffMs = ahora.getTime() - creado.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 30) return "success";
  if (diffMin < 120) return "warning";
  return "muted";
}

export function formatHora(hora: string): string {
  return hora.substring(0, 5);
}

export function esVigente(horaDesde: string, horaHasta: string): boolean {
  const ahora = new Date();
  const horaActual = ahora.getHours() * 60 + ahora.getMinutes();

  const [h1, m1] = horaDesde.split(":").map(Number);
  const [h2, m2] = horaHasta.split(":").map(Number);

  const desde = h1 * 60 + m1;
  const hasta = h2 * 60 + m2;

  if (hasta < desde) {
    return horaActual >= desde || horaActual <= hasta;
  }

  return horaActual >= desde && horaActual <= hasta;
}

export function esProxima(horaDesde: string): boolean {
  const ahora = new Date();
  const horaActual = ahora.getHours() * 60 + ahora.getMinutes();

  const [h, m] = horaDesde.split(":").map(Number);
  const desde = h * 60 + m;

  const diffMinutos = desde - horaActual;
  return diffMinutos >= 0 && diffMinutos <= 24 * 60;
}

export function minutosHastaInicio(horaDesde: string): number {
  const ahora = new Date();
  const horaActual = ahora.getHours() * 60 + ahora.getMinutes();

  const [h, m] = horaDesde.split(":").map(Number);
  const desde = h * 60 + m;

  let diff = desde - horaActual;
  if (diff < 0) diff += 24 * 60;

  return diff;
}

export const ESTADOS: Estado[] = [
  "QAP",
  "A la escucha",
  "Monitoreando",
  "Móvil",
  "Base",
  "CW (Morse)",
];

export const BANDAS: string[] = ["Todas", "HF", "VHF", "UHF"];

export const UNIDADES_FRECUENCIA: UnidadFrecuencia[] = ["kHz", "MHz", "GHz"];