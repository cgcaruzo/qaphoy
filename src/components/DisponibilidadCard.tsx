"use client";

import { IndicadorActividad } from "./IndicadorActividad";
import { formatHora } from "@/lib/utils";
import type { Disponibilidad } from "@/types";

interface DisponibilidadCardProps {
  disponibilidad: Disponibilidad;
  onDelete?: (id: string) => void;
}

export function DisponibilidadCard({
  disponibilidad,
  onDelete,
}: DisponibilidadCardProps) {
  const {
    id,
    indicativo,
    frecuencia,
    banda,
    estado,
    hora_desde,
    hora_hasta,
    observaciones,
    fecha_creacion,
  } = disponibilidad;

  const bandaColor = {
    HF: "bg-orange-100 text-orange-700 border-orange-200",
    VHF: "bg-blue-100 text-blue-700 border-blue-200",
    UHF: "bg-purple-100 text-purple-700 border-purple-200",
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="font-mono text-xl font-bold text-foreground">
            {indicativo}
          </span>
          <span
            className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full border ${
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
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
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

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <IndicadorActividad fechaCreacion={fecha_creacion} />
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="p-2 text-text-muted hover:text-red-500 transition-colors"
            aria-label="Eliminar"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}