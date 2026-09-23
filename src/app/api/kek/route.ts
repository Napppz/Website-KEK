import { NextResponse } from "next/server";
import { Prisma, KekStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { kekSchema } from "@/lib/validations/kek";
import { fallbackKeks } from "@/lib/data/fallback";
import { invalidateCache } from "@/lib/cache";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const province = searchParams.get("province");

    const where: Prisma.KEKWhereInput = {};
    if (status && status !== "ALL") where.status = status as KekStatus;
    if (province && province !== "ALL") where.province = province;

    const keks = await prisma.kEK.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        investments: {
          orderBy: { year: "desc" },
          take: 1,
        },
      },
    });

    if (keks && keks.length > 0) {
      return NextResponse.json({ success: true, data: keks });
    }
  } catch {
    console.warn("Neon query failed in GET /api/kek, using fallback.");
  }

  return NextResponse.json({ success: true, data: fallbackKeks });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = kekSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validasi data gagal", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const kek = await prisma.kEK.create({
      data: parsed.data,
    });

    invalidateCache("kek");
    invalidateCache("admin:dashboard");

    return NextResponse.json({ success: true, data: kek }, { status: 201 });
  } catch (error) {
    console.error("Error creating KEK:", error);
    const message = error instanceof Error ? error.message : "Gagal menambah KEK baru";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
