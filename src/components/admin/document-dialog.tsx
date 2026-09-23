"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { documentSchema, type DocumentInput } from "@/lib/validations/document";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface DocumentData {
  id: string;
  title: string;
  documentNumber: string;
  year: number;
  category: "UNDANG_UNDANG" | "PERATURAN_PEMERINTAH" | "PERATURAN_PRESIDEN" | "PERATURAN_MENTERI" | "KEPUTUSAN_DEWAN_NASIONAL";
  description?: string | null;
  fileUrl: string;
}

interface DocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: DocumentData | null;
  onSuccess: () => void;
}

export function DocumentDialog({ open, onOpenChange, initialData, onSuccess }: DocumentDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DocumentInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(documentSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      documentNumber: initialData?.documentNumber || "",
      year: initialData?.year || new Date().getFullYear(),
      category: initialData?.category || "PERATURAN_PEMERINTAH",
      description: initialData?.description || "",
      fileUrl: initialData?.fileUrl || "",
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        documentNumber: initialData.documentNumber,
        year: initialData.year,
        category: initialData.category,
        description: initialData.description || "",
        fileUrl: initialData.fileUrl || "",
      });
    } else {
      reset({
        title: "",
        documentNumber: "",
        year: new Date().getFullYear(),
        category: "PERATURAN_PEMERINTAH",
        description: "",
        fileUrl: "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: DocumentInput) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const url = initialData ? `/api/dokumen/${initialData.id}` : "/api/dokumen";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan dokumen JDIH.");
      }

      onSuccess();
      onOpenChange(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan dokumen.";
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
            {initialData ? "Edit Dokumen Regulasi JDIH" : "Tambah Dokumen JDIH Baru"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Unggah acuan regulasi hukum dan ketetapan peraturan KEK.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-medium border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Judul Regulasi / Peraturan</label>
            <Input
              placeholder="Contoh: Peraturan Pemerintah tentang Penyelenggaraan KEK"
              {...register("title")}
              className="text-xs h-9"
            />
            {errors.title && <p className="text-[11px] text-red-500">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Nomor Dokumen</label>
              <Input
                placeholder="PP No. 40 Tahun 2021"
                {...register("documentNumber")}
                className="text-xs h-9"
              />
              {errors.documentNumber && (
                <p className="text-[11px] text-red-500">{errors.documentNumber.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Tahun Penetapan</label>
              <Input
                type="number"
                {...register("year", { valueAsNumber: true })}
                className="text-xs h-9"
              />
              {errors.year && <p className="text-[11px] text-red-500">{errors.year.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Kategori Regulasi Hukum</label>
            <select
              {...register("category")}
              className="w-full h-9 rounded-md border border-slate-300 px-3 text-xs bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="PERATURAN_PEMERINTAH">Peraturan Pemerintah (PP)</option>
              <option value="UNDANG_UNDANG">Undang-Undang (UU)</option>
              <option value="PERATURAN_PRESIDEN">Peraturan Presiden (Perpres)</option>
              <option value="PERATURAN_MENTERI">Peraturan Menteri (Permen)</option>
              <option value="KEPUTUSAN_DEWAN_NASIONAL">Keputusan Dewan Nasional</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">URL Berkas PDF / Dokumen</label>
            <Input
              placeholder="https://kek.go.id/documents/pp-40-2021.pdf"
              {...register("fileUrl")}
              className="text-xs h-9"
            />
            {errors.fileUrl && <p className="text-[11px] text-red-500">{errors.fileUrl.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Penjelasan / Perihal</label>
            <textarea
              rows={3}
              {...register("description")}
              placeholder="Ringkasan isi dan muatan hukum..."
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
              {isSubmitting ? "Menyimpan..." : "Simpan Dokumen JDIH"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
