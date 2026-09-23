import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/category";
import { invalidateCache } from "@/lib/cache";
import { createAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validasi data gagal", details: parsed.error.format() },
        { status: 400 }
      );
    }

    // Cek slug jika berubah
    const existing = await prisma.newsCategory.findFirst({
      where: {
        slug: parsed.data.slug,
        id: { not: id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Slug sudah digunakan oleh kategori lain" },
        { status: 400 }
      );
    }

    const updated = await prisma.newsCategory.update({
      where: { id },
      data: parsed.data,
    });

    invalidateCache("news:categories");

    await createAuditLog({
      userId: session.user.id || "admin",
      userEmail: session.user.email || "admin@kek.go.id",
      userName: session.user.name || "Administrator",
      action: "UPDATE",
      entity: "CATEGORY",
      entityId: id,
      metadata: `Memperbarui kategori berita: ${updated.name}`,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui kategori";
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

    // Cek ketergantungan relasi: apakah ada berita yang menggunakan kategori ini
    const newsCount = await prisma.news.count({
      where: { categoryId: id },
    });

    if (newsCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Kategori tidak dapat dihapus karena masih digunakan oleh ${newsCount} artikel berita aktif. Harap ubah kategori artikel terkait terlebih dahulu.`,
        },
        { status: 400 }
      );
    }

    const category = await prisma.newsCategory.delete({
      where: { id },
    });

    invalidateCache("news:categories");

    await createAuditLog({
      userId: session.user.id || "admin",
      userEmail: session.user.email || "admin@kek.go.id",
      userName: session.user.name || "Administrator",
      action: "DELETE",
      entity: "CATEGORY",
      entityId: id,
      metadata: `Menghapus kategori berita: ${category.name}`,
    });

    return NextResponse.json({ success: true, message: "Kategori berhasil dihapus" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menghapus kategori";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
