"use client";

import { formatoTiempoRelativo, colorActividad } from "@/lib/utils";

interface IndicadorActividadProps {
  fechaCreacion: string;
}

export function IndicadorActividad({ fechaCreacion }: IndicadorActividadProps) {
  const color = colorActividad(fechaCreacion);
  const tiempo = formatoTiempoRelativo(fechaCreacion);

  const colorClasses = {
    success: "bg-success",
    warning: "bg-warning",
    muted: "bg-muted",
  };

  return (
    <div className="flex items-center gap-2 text-sm text-text-muted">
      <span className={`w-2 h-2 rounded-full ${colorClasses[color]}`} />
      <span>{tiempo}</span>
    </div>
  );
}