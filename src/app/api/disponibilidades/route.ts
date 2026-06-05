import { NextRequest, NextResponse } from "next/server";
import { getActivas, create } from "@/lib/sql/queries";
import { validarFrecuencia } from "@/lib/utils";
import type { CreateDisponibilidadInput } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const banda = searchParams.get("banda") || undefined;

    const disponibilidades = await getActivas(banda);

    return NextResponse.json(disponibilidades);
  } catch (error) {
    console.error("Error al obtener disponibilidades:", error);
    return NextResponse.json(
      { error: "Error al obtener disponibilidades" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.indicativo || typeof body.indicativo !== "string") {
      return NextResponse.json(
        { error: "Indicativo es requerido" },
        { status: 400 }
      );
    }

    if (!body.frecuencia || typeof body.frecuencia !== "string") {
      return NextResponse.json(
        { error: "Frecuencia es requerida" },
        { status: 400 }
      );
    }

    if (!validarFrecuencia(body.frecuencia)) {
      return NextResponse.json(
        {
          error: "Formato de frecuencia inválido",
          details: "Formato requerido: número decimal + espacio + unidad (kHz, MHz o GHz). Ejemplo: 146.520 MHz",
        },
        { status: 400 }
      );
    }

    if (!body.estado) {
      return NextResponse.json(
        { error: "Estado es requerido" },
        { status: 400 }
      );
    }

    if (!body.hora_desde || !body.hora_hasta) {
      return NextResponse.json(
        { error: "Hora desde y hora hasta son requeridas" },
        { status: 400 }
      );
    }

    const input: CreateDisponibilidadInput = {
      indicativo: body.indicativo.trim().toUpperCase(),
      frecuencia: body.frecuencia.trim(),
      estado: body.estado,
      hora_desde: body.hora_desde,
      hora_hasta: body.hora_hasta,
      observaciones: body.observaciones?.trim(),
    };

    const disponibilidad = await create(input);

    return NextResponse.json(disponibilidad, { status: 201 });
  } catch (error) {
    console.error("Error al crear disponibilidad:", error);
    return NextResponse.json(
      { error: "Error al crear disponibilidad" },
      { status: 500 }
    );
  }
}