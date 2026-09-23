import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { kekSchema } from "@/lib/validations/kek";
import { invalidateCache } from "@/lib/cache";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const kek = await prisma.kEK.findUnique({
      where: { id },
      include: {
        investments: true,
        documents: true,
        galleries: true,
        news: true,
      },
    });

    if (!kek) {
      return NextResponse.json(
        { success: false, error: "KEK tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: kek });
  } catch {
    return NextResponse.json(
      { success: false, error: "Gagal mengambil detail KEK" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = kekSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validasi data gagal", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updated = await prisma.kEK.update({
      where: { id },
      data: parsed.data,
    });

    invalidateCache("kek");
    invalidateCache("admin:dashboard");

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui data KEK";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.kEK.delete({
      where: { id },
    });

    invalidateCache("kek");
    invalidateCache("admin:dashboard");

    return NextResponse.json({ success: true, message: "KEK berhasil dihapus" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menghapus KEK";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
