import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const keks = await prisma.kEK.findMany({
      where: status ? { status: status as "BEROPERASI" | "TAHAP_PEMBANGUNAN" } : undefined,
      orderBy: { name: "asc" },
      include: {
        investments: {
          orderBy: { year: "desc" },
          take: 1,
        },
      },
    });

    return NextResponse.json({ success: true, data: keks });
  } catch (error) {
    console.error("Error fetching KEK:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data KEK" },
      { status: 500 }
    );
  }
}
