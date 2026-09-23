import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/category";
import { invalidateCache } from "@/lib/cache";
import { createAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const categories = await prisma.newsCategory.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { news: true },
        },
      },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch {
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar kategori" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validasi data gagal", details: parsed.error.format() },
        { status: 400 }
      );
    }

    // Cek slug duplikat
    const existing = await prisma.newsCategory.findUnique({
      where: { slug: parsed.data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Kategori dengan slug ini sudah terdaftar" },
        { status: 400 }
      );
    }

    const category = await prisma.newsCategory.create({
      data: parsed.data,
    });

    invalidateCache("news:categories");

    await createAuditLog({
      userId: session.user.id || "admin",
      userEmail: session.user.email || "admin@kek.go.id",
      userName: session.user.name || "Administrator",
      action: "CREATE",
      entity: "CATEGORY",
      entityId: category.id,
      metadata: `Membuat kategori berita baru: ${category.name}`,
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal membuat kategori";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
