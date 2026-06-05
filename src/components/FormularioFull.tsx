"use client";

import { useState, useEffect, useRef } from "react";
import { ESTADOS, UNIDADES_FRECUENCIA, validarNumeroFrecuencia } from "@/lib/utils";
import type { Estado, UnidadFrecuencia } from "@/types";

interface FormularioFullProps {
  onClose: () => void;
  onSubmit: (data: {
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

export function FormularioFull({ onClose, onSubmit }: FormularioFullProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [indicativo, setIndicativo] = useState("");
  const [numeroFrecuencia, setNumeroFrecuencia] = useState("");
  const [unidad, setUnidad] = useState<UnidadFrecuencia>("MHz");
  const [estado, setEstado] = useState<Estado>("QAP");
  const [horaDesde, setHoraDesde] = useState("09:00");
  const [horaHasta, setHoraHasta] = useState("11:00");
  const [observaciones, setObservaciones] = useState("");

  const touchStartX = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  useEffect(() => {
    const input = document.querySelector<HTMLInputElement>('input[placeholder="LU4ABC"]');
    if (input) input.focus();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!indicativo.trim()) {
      setError("El indicativo es requerido");
      return;
    }

    if (!validarNumeroFrecuencia(numeroFrecuencia)) {
      setError("Formato numérico inválido. Usar punto para decimales (ej: 146.520)");
      return;
    }

    if (!horaDesde || !horaHasta) {
      setError("Las horas son requeridas");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        indicativo,
        frecuencia: `${numeroFrecuencia} ${unidad}`,
        estado,
        hora_desde: horaDesde,
        hora_hasta: horaHasta,
        observaciones,
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
          onClick={onClose}
          className="p-2 -ml-2 text-text-muted hover:text-foreground"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">Publicar disponibilidad</h1>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Indicativo *</label>
            <input
              type="text"
              value={indicativo}
              onChange={(e) => setIndicativo(e.target.value.toUpperCase())}
              placeholder="LU4ABC"
              className="w-full px-4 py-3 border border-border rounded-xl bg-card text-lg font-mono uppercase"
              maxLength={10}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Frecuencia *</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={numeroFrecuencia}
                onChange={(e) => setNumeroFrecuencia(e.target.value)}
                placeholder="146.520"
                className="flex-1 px-4 py-3 border border-border rounded-xl bg-card text-lg font-mono"
                required
              />
              <select
                value={unidad}
                onChange={(e) => setUnidad(e.target.value as UnidadFrecuencia)}
                className="px-4 py-3 border border-border rounded-xl bg-card text-lg font-mono"
              >
                {UNIDADES_FRECUENCIA.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-text-muted mt-1">Usar punto para decimales (ej: 146.520)</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estado *</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as Estado)}
              className="w-full px-4 py-3 border border-border rounded-xl bg-card text-lg"
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hora desde *</label>
              <input
                type="time"
                value={horaDesde}
                onChange={(e) => setHoraDesde(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-xl bg-card text-lg font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hora hasta *</label>
              <input
                type="time"
                value={horaHasta}
                onChange={(e) => setHoraHasta(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-xl bg-card text-lg font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Observaciones</label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="También monitoreo APRS"
              className="w-full px-4 py-3 border border-border rounded-xl bg-card text-lg resize-none"
              rows={2}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl text-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </form>
      </div>
    </div>
  );
}