"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldValues, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { documentSchema, type DocumentInput } from "@/lib/validations/document";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormSection,
  FormFieldWrapper,
  FormActions,
} from "./form-components";
import { FileText, Link as LinkIcon } from "lucide-react";

interface DocumentFormProps {
  initialData?: Partial<DocumentInput> & { id?: string };
  isEdit?: boolean;
}

interface KekOption {
  id: string;
  name: string;
}

export function DocumentForm({ initialData, isEdit = false }: DocumentFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [keks, setKeks] = React.useState<KekOption[]>([]);

  const initialDateStr = initialData?.publishedAt
    ? new Date(initialData.publishedAt).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(documentSchema) as unknown as Resolver<FieldValues>,
    defaultValues: {
      title: initialData?.title || "",
      documentNumber: initialData?.documentNumber || "",
      year: initialData?.year || new Date().getFullYear(),
      category: initialData?.category || "Peraturan Pemerintah",
      description: initialData?.description || "",
      fileUrl: initialData?.fileUrl || "",
      kekId: initialData?.kekId || null,
      publishedAt: initialData?.publishedAt ? new Date(initialData.publishedAt) : new Date(),
    },
  });

  const categoryValue = watch("category");
  const kekIdValue = watch("kekId");
  const fileUrlValue = watch("fileUrl");

  React.useEffect(() => {
    async function loadKeks() {
      try {
        const res = await fetch("/api/kek");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setKeks(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat daftar KEK:", err);
      }
    }
    loadKeks();
  }, []);

  const onSubmit = async (data: FieldValues) => {
    setIsSubmitting(true);
    try {
      const url = isEdit && initialData?.id ? `/api/dokumen/${initialData.id}` : "/api/dokumen";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan dokumen");
      }

      addToast({
        title: isEdit ? "Dokumen Diperbarui" : "Dokumen Didaftarkan",
        description: isEdit
          ? `Regulasi ${data.documentNumber} berhasil diperbarui.`
          : `Regulasi ${data.documentNumber} berhasil disimpan ke JDIH.`,
        type: "success",
      });

      router.push("/admin/dokumen");
      router.refresh();
    } catch (err) {
      addToast({
        title: "Penyimpanan Gagal",
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan dokumen.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      {/* 1. Informasi Regulasi */}
      <FormSection
        title="Informasi Regulasi & Legalitas JDIH"
        description="Nomor regulasi, jenis hierarki hukum, dan judul dokumen resmi"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormFieldWrapper
            label="Nomor Dokumen / Regulasi"
            required
            error={errors.documentNumber?.message}
            helpText="Contoh: PP No. 40 Tahun 2021"
          >
            <Input
              {...register("documentNumber")}
              placeholder="PP No. xx Tahun xxxx"
              className="text-xs h-10 font-medium"
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Jenis / Kategori Regulasi"
            required
            error={errors.category?.message}
          >
            <select
              value={categoryValue}
              onChange={(e) => setValue("category", e.target.value, { shouldValidate: true })}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="Undang-Undang">Undang-Undang (UU)</option>
              <option value="Peraturan Pemerintah">Peraturan Pemerintah (PP)</option>
              <option value="Peraturan Presiden">Peraturan Presiden (Perpres)</option>
              <option value="Peraturan Menteri">Peraturan Menteri (Permen)</option>
              <option value="Keputusan Presiden">Keputusan Presiden (Keppres)</option>
              <option value="Keputusan Menteri">Keputusan Menteri (Kepmen)</option>
              <option value="Regulasi Lainnya">Regulasi Lainnya</option>
            </select>
          </FormFieldWrapper>

          <FormFieldWrapper label="Tahun Pengundangan" required error={errors.year?.message}>
            <Input
              type="number"
              {...register("year")}
              placeholder="2024"
              className="text-xs h-10"
            />
          </FormFieldWrapper>
        </div>

        <FormFieldWrapper
          label="Judul Lengkap Dokumen / Regulasi"
          required
          error={errors.title?.message}
          helpText="Nama resmi tentang regulasi (misal: Penyelenggaraan Kawasan Ekonomi Khusus)"
        >
          <Input
            {...register("title")}
            placeholder="Contoh: Peraturan Pemerintah tentang Penyelenggaraan Kawasan Ekonomi Khusus"
            className="text-xs h-10 font-medium"
          />
        </FormFieldWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldWrapper
            label="Terkait Kawasan KEK (Opsional)"
            helpText="Pilih jika regulasi ini adalah penetapan KEK spesifik"
          >
            <select
              value={kekIdValue || ""}
              onChange={(e) => setValue("kekId", e.target.value ? e.target.value : null)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="">-- Berlaku Nasional / Umum --</option>
              {keks.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </select>
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Tanggal Pengundangan / Terbit"
            helpText="Tanggal regulasi resmi diundangkan"
          >
            <Input
              type="date"
              defaultValue={initialDateStr}
              onChange={(e) => {
                if (e.target.value) {
                  setValue("publishedAt", new Date(e.target.value));
                }
              }}
              className="text-xs h-10"
            />
          </FormFieldWrapper>
        </div>

        <FormFieldWrapper
          label="Abstrak / Pokok Penjelasan"
          error={errors.description?.message}
          helpText="Ringkasan poin substansi yang diatur dalam regulasi ini"
        >
          <Textarea
            {...register("description")}
            rows={3}
            placeholder="Tuliskan pokok bahasan atau pertimbangan regulasi..."
            className="text-xs"
          />
        </FormFieldWrapper>
      </FormSection>

      {/* 2. Berkas Dokumen (Storage abstraction) */}
      <FormSection
        title="Tautan Berkas Dokumen (PDF)"
        description="URL berkas digital resmi atau penyimpanan berkas JDIH"
      >
        <FormFieldWrapper
          label="URL Berkas Dokumen (PDF)"
          required
          error={errors.fileUrl?.message}
          helpText="Dapat berupa URL dokumen jdih.bphn.go.id, storage cloud, atau berkas lokal publik (/documents/...)"
        >
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-400 pointer-events-none">
                <LinkIcon className="w-3.5 h-3.5" />
              </span>
              <Input
                {...register("fileUrl")}
                placeholder="https://jdih.setkab.go.id/dokumen/..."
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
        cancelHref="/admin/dokumen"
        isSubmitting={isSubmitting}
        submitLabel={isEdit ? "Perbarui Dokumen JDIH" : "Simpan Dokumen Regulasi"}
      />
    </form>
  );
}
