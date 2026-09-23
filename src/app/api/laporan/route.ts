import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { reportSchema } from "@/lib/validations/report";
import { fallbackReports } from "@/lib/data/fallback";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");

    const where: Prisma.ReportWhereInput = {};
    if (year && !isNaN(Number(year))) where.year = Number(year);

    const reports = await prisma.report.findMany({
      where,
      orderBy: { year: "desc" },
    });

    if (reports && reports.length > 0) {
      return NextResponse.json({ success: true, data: reports });
    }
  } catch {
    console.warn("Neon query failed in GET /api/laporan, using fallback.");
  }

  return NextResponse.json({ success: true, data: fallbackReports });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = reportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validasi data gagal", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const report = await prisma.report.create({
      data: parsed.data,
    });

    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menambah laporan baru";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
