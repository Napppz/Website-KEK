import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const categorySlug = searchParams.get("category");

    const news = await prisma.news.findMany({
      where: {
        status: "PUBLISHED",
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
      include: {
        category: true,
        author: {
          select: { name: true, role: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data berita" },
      { status: 500 }
    );
  }
}
