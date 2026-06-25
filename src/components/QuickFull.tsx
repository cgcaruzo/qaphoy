"use client";

import { useState, useEffect, useRef } from "react";
import { validarNumeroFrecuencia, UNIDADES_FRECUENCIA, validarIndicativo } from "@/lib/utils";
import type { Estado, UnidadFrecuencia } from "@/types";

interface QuickFullProps {
  onClose: () => void;
  onPublish: (data: {
    indicativo: string;
    numero_operador?: string;
    frecuencia: string;
    estado: Estado;
    hora_desde: string;
    hora_hasta: string;
    observaciones: string;
  }) => Promise<void>;
}

const SWIPE_THRESHOLD = 50;
const SWIPE_TIME_LIMIT = 300;

export function QuickFull({ onClose, onPublish }: QuickFullProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"indicativo" | "frecuencia">("indicativo");
  const [indicativo, setIndicativo] = useState("");
  const [numeroOperador, setNumeroOperador] = useState("");
  const [numeroFrecuencia, setNumeroFrecuencia] = useState("");
  const [unidad, setUnidad] = useState<UnidadFrecuencia>("MHz");
  const [error, setError] = useState<string | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  const ahora = new Date();
  const dosHoras = new Date(ahora.getTime() + 2 * 60 * 60 * 1000);
  const horaDesdeStr = ahora.toTimeString().slice(0, 5);
  const horaHastaStr = dosHoras.toTimeString().slice(0, 5);

  useEffect(() => {
    const input = document.querySelector<HTMLInputElement>('input[placeholder="LU4ABC"]');
    if (input) input.focus();
  }, [step]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;
    const deltaTime = Date.now() - touchStartTime.current;

    if (touchStartX.current < SWIPE_THRESHOLD && deltaX > SWIPE_THRESHOLD && deltaTime < SWIPE_TIME_LIMIT) {
      onClose();
    }

    touchStartX.current = null;
  };

  const handleSiguiente = () => {
    setError(null);
    if (!indicativo.trim()) {
      setError("El indicativo es requerido");
      return;
    }
    if (!validarIndicativo(indicativo.trim())) {
      setError("Indicativo inválido. Formato: 1-2 letras, 1 dígito, 1-3 letras");
      return;
    }
    setStep("frecuencia");
  };

  const handlePublish = async () => {
    if (!validarNumeroFrecuencia(numeroFrecuencia)) {
      setError("Número inválido. Usar punto para decimales");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onPublish({
        indicativo: indicativo.toUpperCase(),
        numero_operador: numeroOperador || undefined,
        frecuencia: `${numeroFrecuencia} ${unidad}`,
        estado: "QAP",
        hora_desde: horaDesdeStr,
        hora_hasta: horaHastaStr,
        observaciones: "",
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al publicar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-background z-50 animate-slide-in"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border/60 backdrop-blur-md bg-background/80 sticky top-0 z-10">
        <button
          onClick={step === "frecuencia" ? () => setStep("indicativo") : onClose}
          className="p-2 -ml-2 text-text-muted hover:text-foreground transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">En Frecuencia Ahora</h1>
      </div>

      <div className="p-4">
        {step === "indicativo" ? (
          <div className="space-y-4 animate-fade-in-up" key="indicativo">
            <p className="text-text-muted">Ingresá tu indicativo:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={indicativo}
                onChange={(e) => setIndicativo(e.target.value.toUpperCase())}
                placeholder="LU4ABC"
                className="flex-1 min-w-0 px-4 py-4 border border-border rounded-xl bg-card text-2xl font-mono text-center uppercase transition-shadow focus:shadow-[0_0_0_3px_rgba(26,86,219,0.15)]"
                maxLength={10}
                autoFocus
              />
              <input
                type="text"
                value={numeroOperador}
                onChange={(e) => setNumeroOperador(e.target.value.replace(/\D/g, "").slice(0, 2))}
                placeholder="Nº Op."
                className="w-24 px-2 py-4 border border-border rounded-xl bg-card text-xl font-mono text-center transition-shadow focus:shadow-[0_0_0_3px_rgba(26,86,219,0.15)]"
                maxLength={2}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleSiguiente}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-hover text-white font-semibold rounded-xl text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Siguiente
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in-up" key="frecuencia">
            <p className="text-text-muted">Ingresá la frecuencia:</p>
            <div className="flex gap-2 items-center overflow-visible">
              <input
                type="text"
                value={numeroFrecuencia}
                onChange={(e) => setNumeroFrecuencia(e.target.value)}
                placeholder="146.520"
                className="flex-1 min-w-0 px-4 py-4 border border-border rounded-xl bg-card text-2xl font-mono text-center transition-shadow focus:shadow-[0_0_0_3px_rgba(26,86,219,0.15)]"
                autoFocus
              />
              <select
                value={unidad}
                onChange={(e) => setUnidad(e.target.value as UnidadFrecuencia)}
                className="w-24 px-2 py-4 border border-border rounded-xl bg-card text-xl font-mono text-center"
              >
                {UNIDADES_FRECUENCIA.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-text-muted text-center">
              Horario: {horaDesdeStr} - {horaHastaStr}
            </p>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => setStep("indicativo")}
                className="flex-1 py-4 border border-border rounded-xl font-semibold transition-colors hover:bg-slate-50"
              >
                Volver
              </button>
              <button
                onClick={handlePublish}
                disabled={loading || !numeroFrecuencia.trim()}
                className="flex-1 py-4 bg-gradient-to-r from-success to-green-600 text-white font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? "..." : "Publicar"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}