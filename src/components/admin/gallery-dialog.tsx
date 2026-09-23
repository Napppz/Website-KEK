"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gallerySchema, type GalleryInput } from "@/lib/validations/gallery";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface GalleryData {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string | null;
}

interface GalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: GalleryData | null;
  onSuccess: () => void;
}

export function GalleryDialog({ open, onOpenChange, initialData, onSuccess }: GalleryDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GalleryInput>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      title: initialData?.title || "",
      category: initialData?.category || "Peresmian & Kunjungan",
      imageUrl: initialData?.imageUrl || "",
      description: initialData?.description || "",
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        category: initialData.category,
        imageUrl: initialData.imageUrl,
        description: initialData.description || "",
      });
    } else {
      reset({
        title: "",
        category: "Peresmian & Kunjungan",
        imageUrl: "",
        description: "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: GalleryInput) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const url = initialData ? `/api/galeri/${initialData.id}` : "/api/galeri";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan foto galeri.");
      }

      onSuccess();
      onOpenChange(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan foto.";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">
            {initialData ? "Edit Foto Galeri" : "Tambah Foto Galeri Baru"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Unggah dokumentasi foto kegiatan operasional dan pembangunan KEK.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-medium border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Judul Foto / Dokumentasi</label>
            <Input
              placeholder="Contoh: Kunjungan Kerja Menteri di KEK Sanur"
              {...register("title")}
              className="text-xs h-9"
            />
            {errors.title && <p className="text-[11px] text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Kategori Album Foto</label>
            <Input
              placeholder="Peresmian & Kunjungan, Infrastruktur, Event, dsb."
              {...register("category")}
              className="text-xs h-9"
            />
            {errors.category && <p className="text-[11px] text-red-500">{errors.category.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">URL Foto Resolusi Tinggi</label>
            <Input
              placeholder="https://images.unsplash.com/photo-..."
              {...register("imageUrl")}
              className="text-xs h-9"
            />
            {errors.imageUrl && <p className="text-[11px] text-red-500">{errors.imageUrl.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Keterangan / Deskripsi Foto</label>
            <textarea
              rows={3}
              {...register("description")}
              placeholder="Penjelasan singkat suasana foto..."
              className="w-full rounded-md border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
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
              {isSubmitting ? "Menyimpan..." : "Simpan Foto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
