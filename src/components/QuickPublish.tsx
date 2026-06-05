"use client";

import { useState } from "react";
import { validarNumeroFrecuencia, UNIDADES_FRECUENCIA } from "@/lib/utils";
import { BottomSheet } from "./BottomSheet";
import type { Estado, UnidadFrecuencia } from "@/types";

interface QuickPublishProps {
  isOpen: boolean;
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

export function QuickPublish({ isOpen, onClose, onPublish }: QuickPublishProps) {
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
      resetAndClose();
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

  const resetAndClose = () => {
    setIndicativo("");
    setNumeroFrecuencia("");
    setUnidad("MHz");
    setStep("indicativo");
    setError(null);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={resetAndClose}
      title="En Frecuencia Ahora"
    >
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
          <div className="flex gap-2 items-center">
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
              className="px-4 py-4 border border-border rounded-xl bg-background text-xl font-mono"
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
    </BottomSheet>
  );
}