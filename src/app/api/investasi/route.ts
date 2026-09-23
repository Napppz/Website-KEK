import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { investmentSchema } from "@/lib/validations/investment";
import { invalidateCache } from "@/lib/cache";
import { createAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kekId = searchParams.get("kekId");
    const year = searchParams.get("year");

    const where: Record<string, unknown> = {};
    if (kekId && kekId !== "ALL") where.kekId = kekId;
    if (year && !isNaN(parseInt(year, 10))) where.year = parseInt(year, 10);

    const investments = await prisma.investment.findMany({
      where,
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
      include: {
        kek: {
          select: { name: true, province: true, slug: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: investments });
  } catch {
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data investasi" },
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
    const parsed = investmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validasi data gagal", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const investment = await prisma.investment.create({
      data: {
        kekId: parsed.data.kekId,
        year: parsed.data.year,
        investmentValue: parsed.data.investmentValue,
        employeeCount: parsed.data.employeeCount,
        description: parsed.data.description || null,
      },
      include: {
        kek: { select: { name: true } },
      },
    });

    invalidateCache("kek");
    invalidateCache("admin:dashboard");

    await createAuditLog({
      userId: session.user.id || "admin",
      userEmail: session.user.email || "admin@kek.go.id",
      userName: session.user.name || "Administrator",
      action: "CREATE",
      entity: "INVESTMENT",
      entityId: investment.id,
      metadata: `Menambahkan data investasi untuk ${investment.kek.name} tahun ${investment.year}`,
    });

    return NextResponse.json({ success: true, data: investment }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menambahkan data investasi";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
