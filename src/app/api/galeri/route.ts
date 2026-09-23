import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { gallerySchema } from "@/lib/validations/gallery";
import { fallbackGalleries } from "@/lib/data/fallback";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const where: Prisma.GalleryWhereInput = {};
    if (category && category !== "ALL") where.category = category;

    const galleries = await prisma.gallery.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    if (galleries && galleries.length > 0) {
      return NextResponse.json({ success: true, data: galleries });
    }
  } catch {
    console.warn("Neon query failed in GET /api/galeri, using fallback.");
  }

  return NextResponse.json({ success: true, data: fallbackGalleries });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = gallerySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validasi data gagal", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const item = await prisma.gallery.create({
      data: parsed.data,
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menambah foto galeri baru";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
