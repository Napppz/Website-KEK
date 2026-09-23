"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportSchema, type ReportInput } from "@/lib/validations/report";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface ReportData {
  id: string;
  title: string;
  year: number;
  description?: string | null;
  fileUrl: string;
}

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ReportData | null;
  onSuccess: () => void;
}

export function ReportDialog({ open, onOpenChange, initialData, onSuccess }: ReportDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReportInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(reportSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      year: initialData?.year || new Date().getFullYear(),
      description: initialData?.description || "",
      fileUrl: initialData?.fileUrl || "",
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        year: initialData.year,
        description: initialData.description || "",
        fileUrl: initialData.fileUrl || "",
      });
    } else {
      reset({
        title: "",
        year: new Date().getFullYear(),
        description: "",
        fileUrl: "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: ReportInput) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const url = initialData ? `/api/laporan/${initialData.id}` : "/api/laporan";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan laporan tahunan.");
      }

      onSuccess();
      onOpenChange(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan laporan.";
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
            {initialData ? "Edit Laporan Tahunan Kinerja" : "Tambah Laporan Tahunan Baru"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Unggah dokumen publikasi akuntabilitas kinerja kawasan per tahun.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-medium border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Judul Laporan</label>
            <Input
              placeholder="Contoh: Laporan Kinerja KEK Indonesia Tahun 2025"
              {...register("title")}
              className="text-xs h-9"
            />
            {errors.title && <p className="text-[11px] text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Tahun Laporan</label>
            <Input
              type="number"
              {...register("year", { valueAsNumber: true })}
              className="text-xs h-9"
            />
            {errors.year && <p className="text-[11px] text-red-500">{errors.year.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">URL Berkas PDF Laporan</label>
            <Input
              placeholder="https://kek.go.id/reports/laporan-kinerja-2025.pdf"
              {...register("fileUrl")}
              className="text-xs h-9"
            />
            {errors.fileUrl && <p className="text-[11px] text-red-500">{errors.fileUrl.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Deskripsi / Ringkasan Eksekutif</label>
            <textarea
              rows={3}
              {...register("description")}
              placeholder="Rangkuman realisasi komitmen investasi dan penyerapan tenaga kerja..."
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
              {isSubmitting ? "Menyimpan..." : "Simpan Laporan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
