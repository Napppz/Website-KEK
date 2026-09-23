"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsSchema, type NewsInput } from "@/lib/validations/news";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface NewsCategoryItem {
  id: string;
  name: string;
  slug: string;
}

export interface NewsData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  thumbnailUrl?: string | null;
  publishedAt?: string | Date | null;
  category?: NewsCategoryItem;
  author?: {
    name: string;
    role: string;
  };
}

interface NewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: NewsData | null;
  categories: NewsCategoryItem[];
  onSuccess: () => void;
}

export function NewsDialog({ open, onOpenChange, initialData, categories, onSuccess }: NewsDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(newsSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      categoryId: initialData?.categoryId || (categories[0]?.id || ""),
      status: initialData?.status || "PUBLISHED",
      thumbnailUrl: initialData?.thumbnailUrl || "",
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        slug: initialData.slug || "",
        excerpt: initialData.excerpt || "",
        content: initialData.content || "",
        categoryId: initialData.categoryId || (categories[0]?.id || ""),
        status: initialData.status || "PUBLISHED",
        thumbnailUrl: initialData.thumbnailUrl || "",
      });
    } else {
      reset({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        categoryId: categories[0]?.id || "",
        status: "PUBLISHED",
        thumbnailUrl: "",
      });
    }
  }, [initialData, categories, reset]);

  const onSubmit = async (data: NewsInput) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const url = initialData ? `/api/berita/${initialData.id}` : "/api/berita";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan berita.");
      }

      onSuccess();
      onOpenChange(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan berita.";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">
            {initialData ? "Edit Berita / Siaran Pers" : "Tambah Berita Baru"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Publikasikan siaran pers atau berita resmi keanggotaan KEK.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-medium border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Judul Berita</label>
            <Input
              placeholder="Contoh: Realisasi Investasi KEK Kuartal III Capai Target"
              {...register("title")}
              className="text-xs h-9"
            />
            {errors.title && <p className="text-[11px] text-red-500">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">URL Slug</label>
              <Input
                placeholder="realisasi-investasi-kek-kuartal-iii"
                {...register("slug")}
                className="text-xs h-9"
              />
              {errors.slug && <p className="text-[11px] text-red-500">{errors.slug.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Kategori Berita</label>
              <select
                {...register("categoryId")}
                className="w-full h-9 rounded-md border border-slate-300 px-3 text-xs bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Status Publikasi</label>
              <select
                {...register("status")}
                className="w-full h-9 rounded-md border border-slate-300 px-3 text-xs bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="PUBLISHED">Terbit (Published)</option>
                <option value="DRAFT">Draf (Draft)</option>
                <option value="ARCHIVED">Arsip</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">URL Gambar Banner</label>
              <Input
                placeholder="https://images.unsplash.com/photo-..."
                {...register("thumbnailUrl")}
                className="text-xs h-9"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Cuplikan Ringkas (Excerpt)</label>
            <textarea
              rows={2}
              {...register("excerpt")}
              placeholder="Ringkasan 1-2 kalimat untuk kartu berita..."
              className="w-full rounded-md border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            {errors.excerpt && <p className="text-[11px] text-red-500">{errors.excerpt.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Isi Konten Lengkap</label>
            <textarea
              rows={6}
              {...register("content")}
              placeholder="Isi narasi berita lengkap..."
              className="w-full rounded-md border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            {errors.content && <p className="text-[11px] text-red-500">{errors.content.message}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting} className="bg-blue-700 hover:bg-blue-800 text-white">
              {isSubmitting ? "Menyimpan..." : "Simpan Berita"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
