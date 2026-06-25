"use client";

import { formatHora, esVigente } from "@/lib/utils";
import type { Disponibilidad } from "@/types";

interface DisponibilidadCardProps {
  disponibilidad: Disponibilidad;
}

export function DisponibilidadCard({ disponibilidad }: DisponibilidadCardProps) {
  const {
    indicativo,
    numero_operador,
    frecuencia,
    banda,
    estado,
    hora_desde,
    hora_hasta,
    observaciones,
  } = disponibilidad;

  const vigente = esVigente(hora_desde, hora_hasta);

  const bandaColor = {
    HF: "bg-orange-100 text-orange-700 border-orange-200",
    VHF: "bg-blue-100 text-blue-700 border-blue-200",
    UHF: "bg-purple-100 text-purple-700 border-purple-200",
  };

  return (
    <div
      className={`bg-card rounded-xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
        vigente
          ? "border-success/40 bg-success-soft shadow-success/10"
          : "border-border hover:border-slate-300"
      }`}
    >
      {vigente && (
        <div className="mb-3 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-xs font-semibold text-success tracking-wide">ACTIVO AHORA</span>
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xl font-bold text-foreground tracking-tight">
            {indicativo}
            {numero_operador && (
              <span className="ml-1.5 text-base font-normal text-text-muted">#{numero_operador}</span>
            )}
          </span>
          <span
            className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border ${
              bandaColor[banda]
            }`}
          >
            {banda}
          </span>
        </div>
        <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
          {estado}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
            />
          </svg>
          <span className="font-mono font-medium">{frecuencia}</span>
        </div>

        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-mono">
            {formatHora(hora_desde)} - {formatHora(hora_hasta)}
          </span>
        </div>

        {observaciones && (
          <div className="pt-2 border-t border-border/60">
            <p className="text-text-muted italic text-[13px] leading-relaxed">{observaciones}</p>
          </div>
        )}
      </div>
    </div>
  );
}
