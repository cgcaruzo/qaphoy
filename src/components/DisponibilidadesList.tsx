"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { DisponibilidadCard } from "@/components/DisponibilidadCard";
import { FiltrosBanda } from "@/components/FiltrosBanda";
import { FormularioFull } from "@/components/FormularioFull";
import { QuickFull } from "@/components/QuickFull";
import type { Disponibilidad, Estado } from "@/types";

type PageState = "list" | "quick" | "form";

export function DisponibilidadesList() {
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("Todas");
  const [pageState, setPageState] = useState<PageState>("list");

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
    numero_operador?: string;
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

  if (pageState === "quick") {
    return (
      <QuickFull
        onClose={() => setPageState("list")}
        onPublish={handleCreate}
      />
    );
  }

  if (pageState === "form") {
    return (
      <FormularioFull
        onClose={() => setPageState("list")}
        onSubmit={handleCreate}
      />
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="bg-[#000] text-white px-4 py-4 flex flex-col items-center">
        <Image src="/logo_qaphoy.png" alt="QAPHoy" width={200} height={200} />
      </header>

      <main className="px-4 py-4 space-y-4">
        <button
          onClick={() => setPageState("quick")}
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

        <FiltrosBanda filtroActual={filtro} onFiltroChange={setFiltro} />

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse" />
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
            <p className="text-sm mt-1">¡Sé el primero en publicar!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {disponibilidades.map((d) => (
              <DisponibilidadCard key={d.id} disponibilidad={d} />
            ))}
          </div>
        )}
      </main>

      <button
        onClick={() => setPageState("form")}
        className="fixed bottom-6 right-6 w-14 h-14 bg-success text-white rounded-full shadow-lg shadow-success/30 flex items-center justify-center text-2xl font-bold transition-transform active:scale-95"
        aria-label="Publicar disponibilidad"
      >
        +
      </button>
    </div>
  );
}