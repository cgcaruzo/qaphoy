import { query, queryOne, execute } from "../db";
import type { Disponibilidad, CreateDisponibilidadInput } from "@/types";

export async function getActivas(banda?: string): Promise<Disponibilidad[]> {
  let sql = `
    SELECT 
      id,
      indicativo,
      numero_operador,
      frecuencia,
      banda,
      estado,
      hora_desde,
      hora_hasta,
      observaciones,
      fecha_creacion,
      fecha_expiracion
    FROM disponibilidades
    WHERE fecha_expiracion > NOW()
  `;
  const params: string[] = [];

  if (banda && banda !== "Todas") {
    sql += " AND banda = $1";
    params.push(banda);
  }

  sql += " ORDER BY fecha_expiracion ASC";

  return query<Disponibilidad>(sql, params);
}

export async function getById(id: string): Promise<Disponibilidad | null> {
  return queryOne<Disponibilidad>(
    "SELECT * FROM disponibilidades WHERE id = $1",
    [id]
  );
}

export async function create(data: CreateDisponibilidadInput): Promise<Disponibilidad> {
  const sql = `
    INSERT INTO disponibilidades (
      indicativo, numero_operador, frecuencia, banda, estado, 
      hora_desde, hora_hasta, observaciones, fecha_expiracion
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  const banda = calcularBanda(data.frecuencia);
  const ahora = new Date();
  const [hDesde] = data.hora_desde.split(":").map(Number);
  const [hHasta] = data.hora_hasta.split(":").map(Number);
  const fechaExpiracion = calcularFechaExpiracion(ahora, hDesde, hHasta);
  const fechaExpiracionStr = fechaExpiracion.toISOString();
  const params = [
    data.indicativo.toUpperCase(),
    data.numero_operador || null,
    data.frecuencia,
    banda,
    data.estado,
    data.hora_desde,
    data.hora_hasta,
    data.observaciones || null,
    fechaExpiracionStr,
  ];

  const result = await queryOne<Disponibilidad>(sql, params);
  if (!result) {
    throw new Error("Error al crear disponibilidad");
  }
  return result;
}

function calcularFechaExpiracion(fechaCreacion: Date, horaDesde: number, horaHasta: number): Date {
  const ARG_OFFSET_MS = 3 * 60 * 60 * 1000;

  const localMs = fechaCreacion.getTime() - ARG_OFFSET_MS;
  const localDate = new Date(localMs);

  const y = localDate.getUTCFullYear();
  const m = localDate.getUTCMonth();
  const d = localDate.getUTCDate();

  let expUtcMs = Date.UTC(y, m, d, horaHasta, 0, 0, 0) + ARG_OFFSET_MS;

  if (horaHasta < horaDesde) {
    expUtcMs += 86_400_000;
  }

  return new Date(expUtcMs);
}

export async function remove(id: string): Promise<boolean> {
  const rows = await execute(
    "DELETE FROM disponibilidades WHERE id = $1",
    [id]
  );
  return rows > 0;
}

function calcularBanda(frecuencia: string): string {
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