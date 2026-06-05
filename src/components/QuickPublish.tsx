"use client";

import { useState } from "react";
import { validarNumeroFrecuencia, UNIDADES_FRECUENCIA } from "@/lib/utils";
import type { Estado, UnidadFrecuencia } from "@/types";

interface QuickPublishProps {
  onPublish: (data: {
    indicativo: string;
    frecuencia: string;
    estado: Estado;
    hora_desde: string;
    hora_hasta: string;
    observaciones: string;
  }) => Promise<void>;
}

export function QuickPublish({ onPublish }: QuickPublishProps) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"indicativo" | "frecuencia">("indicativo");
  const [indicativo, setIndicativo] = useState("");
  const [numeroFrecuencia, setNumeroFrecuencia] = useState("");
  const [unidad, setUnidad] = useState<UnidadFrecuencia>("MHz");
  const [error, setError] = useState<string | null>(null);

  const ahora = new Date();
  const dosHoras = new Date(ahora.getTime() + 2 * 60 * 60 * 1000);

  const horaDesdeStr = ahora.toTimeString().slice(0, 5);
  const horaHastaStr = dosHoras.toTimeString().slice(0, 5);

  const handlePublish = async () => {
    if (!validarNumeroFrecuencia(numeroFrecuencia)) {
      setError("Número inválido. Usar punto para decimales");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const frecuenciaCompleta = `${numeroFrecuencia} ${unidad}`;
      await onPublish({
        indicativo: indicativo.toUpperCase(),
        frecuencia: frecuenciaCompleta,
        estado: "QAP",
        hora_desde: horaDesdeStr,
        hora_hasta: horaHastaStr,
        observaciones: "",
      });
      setShow(false);
      setIndicativo("");
      setNumeroFrecuencia("");
      setUnidad("MHz");
      setStep("indicativo");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al publicar");
    } finally {
      setLoading(false);
    }
  };

  const handleSiguiente = () => {
    setError(null);
    if (!indicativo.trim()) {
      setError("El indicativo es requerido");
      return;
    }
    setStep("frecuencia");
  };

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-semibold rounded-2xl text-lg shadow-lg shadow-primary/25 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
        Estoy en frecuencia ahora
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-2xl w-full max-w-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Quick Publish</h2>
            <button
              onClick={() => {
                setShow(false);
                setIndicativo("");
                setNumeroFrecuencia("");
                setUnidad("MHz");
                setStep("indicativo");
                setError(null);
              }}
              className="p-2 text-text-muted hover:text-foreground"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {step === "indicativo" ? (
            <div className="space-y-4">
              <p className="text-text-muted">Ingresá tu indicativo:</p>
              <input
                type="text"
                value={indicativo}
                onChange={(e) => setIndicativo(e.target.value.toUpperCase())}
                placeholder="LU4ABC"
                className="w-full px-4 py-4 border border-border rounded-xl bg-background text-2xl font-mono text-center uppercase"
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
              <div className="flex gap-2">
                <input
                  type="text"
                  value={numeroFrecuencia}
                  onChange={(e) => setNumeroFrecuencia(e.target.value)}
                  placeholder="146.520"
                  className="flex-1 px-4 py-4 border border-border rounded-xl bg-background text-2xl font-mono text-center"
                  autoFocus
                />
                <select
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value as UnidadFrecuencia)}
                  className="px-4 py-3 border border-border rounded-xl bg-background text-xl font-mono"
                >
                  {UNIDADES_FRECUENCIA.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
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
    </div>
  );
}