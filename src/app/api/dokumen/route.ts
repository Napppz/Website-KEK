import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const year = searchParams.get("year");

    const documents = await prisma.document.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(year ? { year: parseInt(year, 10) } : {}),
      },
      orderBy: { year: "desc" },
    });

    return NextResponse.json({ success: true, data: documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data dokumen" },
      { status: 500 }
    );
  }
}
