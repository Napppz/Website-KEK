import { prisma } from "@/lib/prisma";
import { fallbackKeks, fallbackNews, fallbackDocuments, fallbackReports } from "./fallback";

export interface SearchItem {
  id: string;
  title: string;
  type: "KEK" | "BERITA" | "DOKUMEN" | "LAPORAN";
  category: string;
  description: string;
  date?: string | null;
  href: string;
  badge?: string;
}

export interface GlobalSearchResults {
  query: string;
  total: number;
  keks: SearchItem[];
  news: SearchItem[];
  documents: SearchItem[];
  reports: SearchItem[];
}

export async function performGlobalSearch(query: string): Promise<GlobalSearchResults> {
  const trimmed = (query || "").trim();

  if (!trimmed) {
    return {
      query: "",
      total: 0,
      keks: [],
      news: [],
      documents: [],
      reports: [],
    };
  }

  try {
    const [keks, news, documents, reports] = await Promise.all([
      prisma.kEK.findMany({
        where: {
          OR: [
            { name: { contains: trimmed, mode: "insensitive" } },
            { province: { contains: trimmed, mode: "insensitive" } },
            { city: { contains: trimmed, mode: "insensitive" } },
            { focus: { contains: trimmed, mode: "insensitive" } },
            { description: { contains: trimmed, mode: "insensitive" } },
          ],
        },
        take: 10,
        select: {
          id: true,
          name: true,
          slug: true,
          province: true,
          focus: true,
          description: true,
          status: true,
        },
      }),
      prisma.news.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: trimmed, mode: "insensitive" } },
            { excerpt: { contains: trimmed, mode: "insensitive" } },
            { content: { contains: trimmed, mode: "insensitive" } },
          ],
        },
        take: 10,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          publishedAt: true,
          category: { select: { name: true } },
        },
      }),
      prisma.document.findMany({
        where: {
          OR: [
            { title: { contains: trimmed, mode: "insensitive" } },
            { documentNumber: { contains: trimmed, mode: "insensitive" } },
            { description: { contains: trimmed, mode: "insensitive" } },
          ],
        },
        take: 10,
        select: {
          id: true,
          title: true,
          documentNumber: true,
          category: true,
          year: true,
          description: true,
          fileUrl: true,
        },
      }),
      prisma.report.findMany({
        where: {
          OR: [
            { title: { contains: trimmed, mode: "insensitive" } },
            { description: { contains: trimmed, mode: "insensitive" } },
          ],
        },
        take: 10,
        select: {
          id: true,
          title: true,
          year: true,
          description: true,
          fileUrl: true,
        },
      }),
    ]);

    const kekResults: SearchItem[] = keks.map((k) => ({
      id: k.id,
      title: k.name,
      type: "KEK",
      category: k.province,
      description: k.description,
      href: `/kek-indonesia/${k.slug}`,
      badge: k.status === "BEROPERASI" ? "Beroperasi" : "Tahap Pembangunan",
    }));

    const newsResults: SearchItem[] = news.map((n) => ({
      id: n.id,
      title: n.title,
      type: "BERITA",
      category: n.category?.name || "Siaran Pers",
      description: n.excerpt,
      date: n.publishedAt ? new Date(n.publishedAt).toLocaleDateString("id-ID", { dateStyle: "medium" }) : null,
      href: `/berita/${n.slug}`,
    }));

    const docResults: SearchItem[] = documents.map((d) => ({
      id: d.id,
      title: `${d.title} (${d.documentNumber})`,
      type: "DOKUMEN",
      category: d.category,
      description: d.description || `Regulasi KEK Republik Indonesia Tahun ${d.year}`,
      date: `Tahun ${d.year}`,
      href: `/jdih?q=${encodeURIComponent(d.documentNumber)}`,
      badge: d.category,
    }));

    const reportResults: SearchItem[] = reports.map((r) => ({
      id: r.id,
      title: r.title,
      type: "LAPORAN",
      category: "Laporan Kinerja",
      description: r.description || `Laporan Akuntabilitas & Kinerja KEK Tahun ${r.year}`,
      date: `Tahun ${r.year}`,
      href: `/laporan?year=${r.year}`,
      badge: `Tahun ${r.year}`,
    }));

    const total = kekResults.length + newsResults.length + docResults.length + reportResults.length;

    return {
      query: trimmed,
      total,
      keks: kekResults,
      news: newsResults,
      documents: docResults,
      reports: reportResults,
    };
  } catch {
    console.warn("Neon query for global search failed, querying fallback.");
  }

  // Fallback search
  const q = trimmed.toLowerCase();

  const kekResults: SearchItem[] = fallbackKeks
    .filter(
      (k) =>
        k.name.toLowerCase().includes(q) ||
        k.province.toLowerCase().includes(q) ||
        k.focus.toLowerCase().includes(q) ||
        k.description.toLowerCase().includes(q)
    )
    .slice(0, 10)
    .map((k) => ({
      id: k.id,
      title: k.name,
      type: "KEK",
      category: k.province,
      description: k.description,
      href: `/kek-indonesia/${k.slug}`,
      badge: k.status === "BEROPERASI" ? "Beroperasi" : "Tahap Pembangunan",
    }));

  const newsResults: SearchItem[] = fallbackNews
    .filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.excerpt.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    )
    .slice(0, 10)
    .map((n) => ({
      id: n.id,
      title: n.title,
      type: "BERITA",
      category: n.category?.name || "Siaran Pers",
      description: n.excerpt,
      date: n.publishedAt ? new Date(n.publishedAt).toLocaleDateString("id-ID", { dateStyle: "medium" }) : null,
      href: `/berita/${n.slug}`,
    }));

  const docResults: SearchItem[] = fallbackDocuments
    .filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.documentNumber.toLowerCase().includes(q) ||
        (d.description && d.description.toLowerCase().includes(q))
    )
    .slice(0, 10)
    .map((d) => ({
      id: d.id,
      title: `${d.title} (${d.documentNumber})`,
      type: "DOKUMEN",
      category: d.category,
      description: d.description || `Regulasi KEK Republik Indonesia Tahun ${d.year}`,
      date: `Tahun ${d.year}`,
      href: `/jdih?q=${encodeURIComponent(d.documentNumber)}`,
      badge: d.category,
    }));

  const reportResults: SearchItem[] = fallbackReports
    .filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q))
    )
    .slice(0, 10)
    .map((r) => ({
      id: r.id,
      title: r.title,
      type: "LAPORAN",
      category: "Laporan Kinerja",
      description: r.description || `Laporan Akuntabilitas & Kinerja KEK Tahun ${r.year}`,
      date: `Tahun ${r.year}`,
      href: `/laporan?year=${r.year}`,
      badge: `Tahun ${r.year}`,
    }));

  const total = kekResults.length + newsResults.length + docResults.length + reportResults.length;

  return {
    query: trimmed,
    total,
    keks: kekResults,
    news: newsResults,
    documents: docResults,
    reports: reportResults,
  };
}
