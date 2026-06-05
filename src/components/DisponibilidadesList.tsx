"use client";

import { useState, useEffect, useCallback } from "react";
import { DisponibilidadCard } from "@/components/DisponibilidadCard";
import { FiltrosBanda } from "@/components/FiltrosBanda";
import { Formulario } from "@/components/Formulario";
import { QuickPublish } from "@/components/QuickPublish";
import type { Disponibilidad, Estado } from "@/types";

export function DisponibilidadesList() {
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("Todas");
  const [showForm, setShowForm] = useState(false);
  const [showQuick, setShowQuick] = useState(false);

  const fetchDisponibilidades = useCallback(async () => {
    try {
      const url =
        filtro === "Todas"
          ? "/api/disponibilidades"
          : `/api/disponibilidades?banda=${filtro}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error al cargar");
      const data = await res.json();
      setDisponibilidades(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filtro]);

  useEffect(() => {
    fetchDisponibilidades();
    const interval = setInterval(fetchDisponibilidades, 30000);
    return () => clearInterval(interval);
  }, [fetchDisponibilidades]);

  const handleCreate = async (data: {
    indicativo: string;
    frecuencia: string;
    estado: Estado;
    hora_desde: string;
    hora_hasta: string;
    observaciones: string;
  }) => {
    const res = await fetch("/api/disponibilidades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || error.details || "Error al crear");
    }
    fetchDisponibilidades();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta disponibilidad?")) return;
    const res = await fetch(`/api/disponibilidades/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar");
    fetchDisponibilidades();
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="bg-primary text-white px-4 py-6">
        <h1 className="text-2xl font-bold font-mono">QAPHoy</h1>
        <p className="text-white/80 text-sm">Radioaficionados en frecuencia</p>
      </header>

      <main className="px-4 py-4 space-y-4">
        <QuickPublish
          onPublish={async (data) => {
            await handleCreate(data);
          }}
        />

        <FiltrosBanda filtroActual={filtro} onFiltroChange={setFiltro} />

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-slate-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : disponibilidades.length === 0 ? (
          <div className="text-center py-12 text-text-muted">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <p>No hay estaciones activas</p>
            <p className="text-sm mt-1">
              ¡Sé el primero en publicar!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {disponibilidades.map((d) => (
              <DisponibilidadCard
                key={d.id}
                disponibilidad={d}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-success text-white rounded-full shadow-lg shadow-success/30 flex items-center justify-center text-2xl font-bold transition-transform active:scale-95"
        aria-label="Publicar disponibilidad"
      >
        +
      </button>

      {showForm && (
        <Formulario
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}