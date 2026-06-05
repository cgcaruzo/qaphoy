"use client";

import { useState, useEffect, useRef } from "react";
import { validarNumeroFrecuencia, UNIDADES_FRECUENCIA } from "@/lib/utils";
import type { Estado, UnidadFrecuencia } from "@/types";

interface QuickFullProps {
  onClose: () => void;
  onPublish: (data: {
    indicativo: string;
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
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <button
          onClick={step === "frecuencia" ? () => setStep("indicativo") : onClose}
          className="p-2 -ml-2 text-text-muted hover:text-foreground"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">En Frecuencia Ahora</h1>
      </div>

      <div className="p-4">
        {step === "indicativo" ? (
          <div className="space-y-4">
            <p className="text-text-muted">Ingresá tu indicativo:</p>
            <input
              type="text"
              value={indicativo}
              onChange={(e) => setIndicativo(e.target.value.toUpperCase())}
              placeholder="LU4ABC"
              className="w-full px-4 py-4 border border-border rounded-xl bg-card text-2xl font-mono text-center uppercase"
              maxLength={10}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleSiguiente}
              className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl text-lg"
            >
              Siguiente
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-text-muted">Ingresá la frecuencia:</p>
            <div className="flex gap-2 items-center overflow-visible">
              <input
                type="text"
                value={numeroFrecuencia}
                onChange={(e) => setNumeroFrecuencia(e.target.value)}
                placeholder="146.520"
                className="flex-1 px-4 py-4 border border-border rounded-xl bg-card text-2xl font-mono text-center"
                autoFocus
              />
              <select
                value={unidad}
                onChange={(e) => setUnidad(e.target.value as UnidadFrecuencia)}
                className="w-20 px-2 py-4 border border-border rounded-xl bg-card text-xl font-mono text-center"
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
                className="flex-1 py-4 border border-border rounded-xl font-semibold"
              >
                Volver
              </button>
              <button
                onClick={handlePublish}
                disabled={loading || !numeroFrecuencia.trim()}
                className="flex-1 py-4 bg-success text-white font-semibold rounded-xl disabled:opacity-50"
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