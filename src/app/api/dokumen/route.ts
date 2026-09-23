import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { documentSchema } from "@/lib/validations/document";
import { fallbackDocuments } from "@/lib/data/fallback";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const year = searchParams.get("year");

    const where: Prisma.DocumentWhereInput = {};
    if (category && category !== "ALL") where.category = category;
    if (year && !isNaN(Number(year))) where.year = Number(year);

    const docs = await prisma.document.findMany({
      where,
      orderBy: { year: "desc" },
    });

    if (docs && docs.length > 0) {
      return NextResponse.json({ success: true, data: docs });
    }
  } catch {
    console.warn("Neon query failed in GET /api/dokumen, using fallback.");
  }

  return NextResponse.json({ success: true, data: fallbackDocuments });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = documentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validasi data gagal", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const doc = await prisma.document.create({
      data: parsed.data,
    });

    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menambah dokumen baru";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
