import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { newsSchema } from "@/lib/validations/news";
import { fallbackNews } from "@/lib/data/fallback";
import { invalidateCache } from "@/lib/cache";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    const where: Prisma.NewsWhereInput = {};
    if (category && category !== "ALL") where.category = { slug: category };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const news = await prisma.news.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      include: {
        category: true,
        author: { select: { name: true, role: true } },
      },
    });

    if (news && news.length > 0) {
      return NextResponse.json({ success: true, data: news });
    }
  } catch {
    console.warn("Neon query failed in GET /api/berita, using fallback.");
  }

  return NextResponse.json({ success: true, data: fallbackNews });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = newsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validasi data gagal", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const defaultUser = await prisma.user.findFirst();
    const authorId = defaultUser?.id || "user-admin";

    const news = await prisma.news.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        thumbnailUrl: parsed.data.thumbnailUrl,
        status: parsed.data.status || "PUBLISHED",
        categoryId: parsed.data.categoryId,
        authorId,
        kekId: parsed.data.kekId || null,
        publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : new Date(),
      },
    });

    invalidateCache("news");
    invalidateCache("admin:dashboard");

    return NextResponse.json({ success: true, data: news }, { status: 201 });
  } catch (error) {
    console.error("Error creating news:", error);
    const message = error instanceof Error ? error.message : "Gagal menambah berita baru";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
