"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldValues, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gallerySchema, type GalleryInput } from "@/lib/validations/gallery";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormSection,
  FormFieldWrapper,
  ImagePreview,
  FormActions,
} from "./form-components";

interface GalleryFormProps {
  initialData?: Partial<GalleryInput> & { id?: string };
  isEdit?: boolean;
}

interface KekOption {
  id: string;
  name: string;
}

export function GalleryForm({ initialData, isEdit = false }: GalleryFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [keks, setKeks] = React.useState<KekOption[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(gallerySchema) as unknown as Resolver<FieldValues>,
    defaultValues: {
      title: initialData?.title || "",
      category: initialData?.category || "Infrastruktur & Fasilitas",
      description: initialData?.description || "",
      imageUrl: initialData?.imageUrl || "",
      kekId: initialData?.kekId || null,
    },
  });

  const imageUrlValue = watch("imageUrl");
  const categoryValue = watch("category");
  const kekIdValue = watch("kekId");

  React.useEffect(() => {
    async function loadKeks() {
      try {
        const res = await fetch("/api/kek");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setKeks(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat KEK:", err);
      }
    }
    loadKeks();
  }, []);

  const onSubmit = async (data: FieldValues) => {
    setIsSubmitting(true);
    try {
      const url = isEdit && initialData?.id ? `/api/galeri/${initialData.id}` : "/api/galeri";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan foto galeri");
      }

      addToast({
        title: isEdit ? "Foto Galeri Diperbarui" : "Foto Galeri Ditambahkan",
        description: isEdit
          ? `Foto "${data.title}" berhasil diperbarui.`
          : `Foto "${data.title}" berhasil ditambahkan ke galeri.`,
        type: "success",
      });

      router.push("/admin/galeri");
      router.refresh();
    } catch (err) {
      addToast({
        title: "Penyimpanan Gagal",
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan foto.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      {/* 1. Informasi Foto */}
      <FormSection
        title="Informasi Dokumentasi Visual"
        description="Judul foto, kategori aktivitas kawasan, dan takarir penjelasan"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldWrapper label="Judul Foto / Dokumentasi" required error={errors.title?.message}>
            <Input
              {...register("title")}
              placeholder="Contoh: Peresmian Pabrik Pengolahan Tembaga"
              className="text-xs h-10 font-medium"
            />
          </FormFieldWrapper>

          <FormFieldWrapper label="Kategori Dokumentasi" required error={errors.category?.message}>
            <select
              value={categoryValue}
              onChange={(e) => setValue("category", e.target.value, { shouldValidate: true })}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="Infrastruktur & Fasilitas">Infrastruktur & Fasilitas</option>
              <option value="Peresmian & Groundbreaking">Peresmian & Groundbreaking</option>
              <option value="Kunjungan Kerja & Diplomasi">Kunjungan Kerja & Diplomasi</option>
              <option value="Kawasan Industri & Pelabuhan">Kawasan Industri & Pelabuhan</option>
              <option value="Pariwisata & Hospitaliti">Pariwisata & Hospitaliti</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </FormFieldWrapper>
        </div>

        <FormFieldWrapper
          label="Terkait Kawasan KEK (Opsional)"
          helpText="Tautkan dengan kawasan KEK tempat momen ini diambil"
        >
          <select
            value={kekIdValue || ""}
            onChange={(e) => setValue("kekId", e.target.value ? e.target.value : null)}
            className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            <option value="">-- Dokumentasi Umum --</option>
            {keks.map((k) => (
              <option key={k.id} value={k.id}>
                {k.name}
              </option>
            ))}
          </select>
        </FormFieldWrapper>

        <FormFieldWrapper
          label="Keterangan / Caption Foto"
          error={errors.description?.message}
          helpText="Deskripsi singkat konteks, tanggal kegiatan, atau tokoh yang hadir"
        >
          <Textarea
            {...register("description")}
            rows={3}
            placeholder="Tuliskan keterangan detail foto dokumentasi ini..."
            className="text-xs"
          />
        </FormFieldWrapper>
      </FormSection>

      {/* 2. Media Berkas */}
      <FormSection
        title="Gambar Resolusi Tinggi"
        description="Masukkan URL gambar resmi foto dokumentasi"
      >
        <ImagePreview
          value={imageUrlValue || ""}
          onChange={(url) => setValue("imageUrl", url, { shouldValidate: true })}
          label="URL Gambar Foto"
          helpText="Mendukung URL gambar langsung (Unsplash, CDN foto, atau penyimpanan media portal)"
        />
      </FormSection>

      {/* 3. Action Buttons */}
      <FormActions
        cancelHref="/admin/galeri"
        isSubmitting={isSubmitting}
        submitLabel={isEdit ? "Perbarui Foto Galeri" : "Simpan Foto ke Galeri"}
      />
    </form>
  );
}
