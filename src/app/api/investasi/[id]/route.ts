import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { investmentSchema } from "@/lib/validations/investment";
import { invalidateCache } from "@/lib/cache";
import { createAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const item = await prisma.investment.findUnique({
      where: { id },
      include: { kek: true },
    });

    if (!item) {
      return NextResponse.json({ success: false, error: "Data investasi tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = investmentSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validasi data gagal", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updated = await prisma.investment.update({
      where: { id },
      data: parsed.data,
      include: { kek: { select: { name: true } } },
    });

    invalidateCache("kek");
    invalidateCache("admin:dashboard");

    await createAuditLog({
      userId: session.user.id || "admin",
      userEmail: session.user.email || "admin@kek.go.id",
      userName: session.user.name || "Administrator",
      action: "UPDATE",
      entity: "INVESTMENT",
      entityId: id,
      metadata: `Memperbarui data investasi ${updated.kek.name} tahun ${updated.year}`,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui data";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await prisma.investment.delete({
      where: { id },
      include: { kek: { select: { name: true } } },
    });

    invalidateCache("kek");
    invalidateCache("admin:dashboard");

    await createAuditLog({
      userId: session.user.id || "admin",
      userEmail: session.user.email || "admin@kek.go.id",
      userName: session.user.name || "Administrator",
      action: "DELETE",
      entity: "INVESTMENT",
      entityId: id,
      metadata: `Menghapus data investasi ${deleted.kek.name} tahun ${deleted.year}`,
    });

    return NextResponse.json({ success: true, message: "Data investasi berhasil dihapus" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menghapus data";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
