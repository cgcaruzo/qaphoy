"use client";

import { formatHora, esVigente } from "@/lib/utils";
import type { Disponibilidad } from "@/types";

interface DisponibilidadCardProps {
  disponibilidad: Disponibilidad;
}

export function DisponibilidadCard({ disponibilidad }: DisponibilidadCardProps) {
  const {
    indicativo,
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
      className={`bg-card rounded-xl border p-4 shadow-sm transition-all ${
        vigente
          ? "border-success shadow-success/20 bg-success/5"
          : "border-border"
      }`}
    >
      {vigente && (
        <div className="mb-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-medium text-success">ACTIVO AHORA</span>
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xl font-bold text-foreground">
            {indicativo}
          </span>
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full border ${
              bandaColor[banda]
            }`}
          >
            {banda}
          </span>
        </div>
        <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
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
              d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"
            />
          </svg>
          <span className="font-mono">{frecuencia}</span>
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
          <span>
            {formatHora(hora_desde)} - {formatHora(hora_hasta)}
          </span>
        </div>

        {observaciones && (
          <div className="pt-2 border-t border-border">
            <p className="text-text-muted italic">{observaciones}</p>
          </div>
        )}
      </div>
    </div>
  );
}