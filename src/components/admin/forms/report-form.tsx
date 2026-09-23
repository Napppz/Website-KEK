"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportSchema, type ReportInput } from "@/lib/validations/report";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormSection,
  FormFieldWrapper,
  FormActions,
} from "./form-components";
import { Link as LinkIcon, FileText } from "lucide-react";

interface ReportFormProps {
  initialData?: Partial<ReportInput> & { id?: string };
  isEdit?: boolean;
}

export function ReportForm({ initialData, isEdit = false }: ReportFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReportInput>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: initialData?.title || "",
      year: initialData?.year || new Date().getFullYear(),
      description: initialData?.description || "",
      fileUrl: initialData?.fileUrl || "",
    },
  });

  const fileUrlValue = watch("fileUrl");

  const onSubmit = async (data: ReportInput) => {
    setIsSubmitting(true);
    try {
      const url = isEdit && initialData?.id ? `/api/laporan/${initialData.id}` : "/api/laporan";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan laporan");
      }

      addToast({
        title: isEdit ? "Laporan Diperbarui" : "Laporan Ditambahkan",
        description: isEdit
          ? `Laporan "${data.title}" berhasil diperbarui.`
          : `Laporan "${data.title}" berhasil disimpan ke arsip.`,
        type: "success",
      });

      router.push("/admin/laporan");
      router.refresh();
    } catch (err) {
      addToast({
        title: "Penyimpanan Gagal",
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan laporan.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      {/* 1. Informasi Laporan */}
      <FormSection
        title="Informasi Laporan Kinerja"
        description="Judul dokumen laporan, periode tahun akuntabilitas, dan ikhtisar isi"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <FormFieldWrapper
              label="Judul Laporan Kinerja"
              required
              error={errors.title?.message}
              helpText="Contoh: Laporan Akuntabilitas Kinerja Instansi Pemerintah (LAKIP) KEK 2024"
            >
              <Input
                {...register("title")}
                placeholder="Judul resmi dokumen laporan..."
                className="text-xs h-10 font-medium"
              />
            </FormFieldWrapper>
          </div>

          <FormFieldWrapper label="Tahun Periode Laporan" required error={errors.year?.message}>
            <Input
              type="number"
              {...register("year", { valueAsNumber: true })}
              placeholder="2024"
              className="text-xs h-10"
            />
          </FormFieldWrapper>
        </div>

        <FormFieldWrapper
          label="Ringkasan / Ikhtisar Eksekutif"
          error={errors.description?.message}
          helpText="Ringkasan capaian indikator kinerja utama, realisasi program kerja, atau catatan akuntabilitas"
        >
          <Textarea
            {...register("description")}
            rows={4}
            placeholder="Tuliskan poin-poin utama pencapaian laporan..."
            className="text-xs"
          />
        </FormFieldWrapper>
      </FormSection>

      {/* 2. Berkas Dokumen PDF */}
      <FormSection
        title="Tautan Berkas Laporan (PDF)"
        description="URL berkas digital resmi atau penyimpanan berkas laporan"
      >
        <FormFieldWrapper
          label="URL Berkas Laporan (PDF)"
          required
          error={errors.fileUrl?.message}
          helpText="Dapat berupa URL dokumen resmi pemerintah, cloud storage, atau file lokal (/reports/...)"
        >
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-400 pointer-events-none">
                <LinkIcon className="w-3.5 h-3.5" />
              </span>
              <Input
                {...register("fileUrl")}
                placeholder="https://kek.go.id/laporan/...pdf"
                className="text-xs h-10 pl-9"
              />
            </div>
            {fileUrlValue && (
              <a
                href={fileUrlValue}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 text-blue-700 flex items-center gap-1 shrink-0 h-10"
              >
                <FileText className="w-3.5 h-3.5" />
                Tes Tautan
              </a>
            )}
          </div>
        </FormFieldWrapper>
      </FormSection>

      {/* 3. Action Buttons */}
      <FormActions
        cancelHref="/admin/laporan"
        isSubmitting={isSubmitting}
        submitLabel={isEdit ? "Perbarui Laporan Kinerja" : "Simpan Laporan Kinerja"}
      />
    </form>
  );
}
