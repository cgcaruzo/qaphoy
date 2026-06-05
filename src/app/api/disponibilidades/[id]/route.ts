import { NextRequest, NextResponse } from "next/server";
import { getById, remove } from "@/lib/sql/queries";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "ID es requerido" },
        { status: 400 }
      );
    }

    const existente = await getById(id);
    if (!existente) {
      return NextResponse.json(
        { error: "Disponibilidad no encontrada" },
        { status: 404 }
      );
    }

    await remove(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar disponibilidad:", error);
    return NextResponse.json(
      { error: "Error al eliminar disponibilidad" },
      { status: 500 }
    );
  }
}