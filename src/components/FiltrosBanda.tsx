"use client";

import { BANDAS } from "@/lib/utils";

interface FiltrosBandaProps {
  filtroActual: string;
  onFiltroChange: (banda: string) => void;
}

export function FiltrosBanda({ filtroActual, onFiltroChange }: FiltrosBandaProps) {
  return (
    <div className="flex gap-1 p-1 bg-slate-100/80 rounded-xl">
      {BANDAS.map((banda) => (
        <button
          key={banda}
          onClick={() => onFiltroChange(banda)}
          className={`relative flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            filtroActual === banda
              ? "bg-white text-primary shadow-sm scale-[1.02]"
              : "text-text-muted hover:text-foreground hover:bg-white/50"
          }`}
        >
          {banda}
        </button>
      ))}
    </div>
  );
}
