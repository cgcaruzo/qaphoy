"use client";

import { BANDAS } from "@/lib/utils";

interface FiltrosBandaProps {
  filtroActual: string;
  onFiltroChange: (banda: string) => void;
}

export function FiltrosBanda({ filtroActual, onFiltroChange }: FiltrosBandaProps) {
  return (
    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
      {BANDAS.map((banda) => (
        <button
          key={banda}
          onClick={() => onFiltroChange(banda)}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            filtroActual === banda
              ? "bg-white text-primary shadow-sm"
              : "text-text-muted hover:text-foreground"
          }`}
        >
          {banda}
        </button>
      ))}
    </div>
  );
}