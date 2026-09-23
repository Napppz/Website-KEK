"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldValues, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { kekSchema, type KekInput } from "@/lib/validations/kek";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormSection,
  FormFieldWrapper,
  SlugInput,
  ImagePreview,
  StatusSelect,
  FormActions,
} from "./form-components";

interface KEKFormProps {
  initialData?: Partial<KekInput> & { id?: string };
  isEdit?: boolean;
}

export function KEKForm({ initialData, isEdit = false }: KEKFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(kekSchema) as unknown as Resolver<FieldValues>,
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      province: initialData?.province || "",
      city: initialData?.city || "",
      address: initialData?.address || "",
      area: initialData?.area ? Number(initialData.area) : 0,
      focus: initialData?.focus || "",
      status: initialData?.status || "BEROPERASI",
      latitude: initialData?.latitude ? Number(initialData.latitude) : -6.2,
      longitude: initialData?.longitude ? Number(initialData.longitude) : 106.8,
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const nameValue = watch("name");
  const slugValue = watch("slug");
  const imageUrlValue = watch("imageUrl");
  const statusValue = watch("status");

  const generateSlugFromName = () => {
    if (!nameValue) return;
    const generated = nameValue
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setValue("slug", generated, { shouldValidate: true });
  };

  const onSubmit = async (data: FieldValues) => {
    setIsSubmitting(true);
    try {
      const url = isEdit && initialData?.id ? `/api/kek/${initialData.id}` : "/api/kek";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan data KEK");
      }

      addToast({
        title: isEdit ? "Data KEK Diperbarui" : "Data KEK Ditambahkan",
        description: isEdit
          ? `Kawasan ${data.name} berhasil diperbarui.`
          : `Kawasan ${data.name} berhasil didaftarkan ke portal.`,
        type: "success",
      });

      router.push("/admin/kek");
      router.refresh();
    } catch (err) {
      addToast({
        title: "Penyimpanan Gagal",
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      {/* 1. Informasi Utama */}
      <FormSection
        title="Informasi Dasar Kawasan"
        description="Identitas resmi nama KEK dan tautan URL slug untuk halaman publik"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldWrapper label="Nama Kawasan (KEK)" required error={errors.name?.message}>
            <Input
              {...register("name")}
              placeholder="Contoh: KEK Sei Mangkei"
              className="text-xs h-10"
            />
          </FormFieldWrapper>

          <SlugInput
            value={slugValue}
            onChange={(val) => setValue("slug", val, { shouldValidate: true })}
            onGenerateFromTitle={generateSlugFromName}
            error={errors.slug?.message}
            prefix="/kek/"
          />
        </div>

        <FormFieldWrapper
          label="Deskripsi Lengkap Kawasan"
          required
          error={errors.description?.message}
          helpText="Profil, keunggulan geo-ekonomi, dan fasilitas utama kawasan"
        >
          <Textarea
            {...register("description")}
            rows={4}
            placeholder="Tuliskan gambaran umum dan profil keunggulan kawasan ini..."
            className="text-xs"
          />
        </FormFieldWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldWrapper
            label="Sektor Fokus Pengembangan"
            required
            error={errors.focus?.message}
            helpText="Contoh: Industri Kelapa Sawit, Pariwisata & Ekonomi Digital"
          >
            <Input
              {...register("focus")}
              placeholder="Sektor fokus industri"
              className="text-xs h-10"
            />
          </FormFieldWrapper>

          <StatusSelect
            value={statusValue}
            onChange={(val) => setValue("status", val as "BEROPERASI" | "TAHAP_PEMBANGUNAN")}
            options={[
              { label: "Beroperasi (Aktif Melayani Investor)", value: "BEROPERASI" },
              { label: "Tahap Pembangunan (Konstruksi)", value: "TAHAP_PEMBANGUNAN" },
            ]}
            label="Status Operasional Kawasan"
          />
        </div>
      </FormSection>

      {/* 2. Lokasi Geografis & Batas Wilayah */}
      <FormSection
        title="Lokasi Geografis & Dimensi Wilayah"
        description="Alamat administratif, luas lahan Hektar, dan koordinat peta GIS Leaflet"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormFieldWrapper label="Provinsi" required error={errors.province?.message}>
            <Input
              {...register("province")}
              placeholder="Contoh: Sumatera Utara"
              className="text-xs h-10"
            />
          </FormFieldWrapper>

          <FormFieldWrapper label="Kota / Kabupaten" required error={errors.city?.message}>
            <Input
              {...register("city")}
              placeholder="Contoh: Kab. Simalungun"
              className="text-xs h-10"
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Luas Wilayah (Hektar / Ha)"
            required
            error={errors.area?.message}
          >
            <Input
              type="number"
              step="0.01"
              {...register("area")}
              placeholder="1933.8"
              className="text-xs h-10"
            />
          </FormFieldWrapper>
        </div>

        <FormFieldWrapper label="Alamat Fisik Lengkap" required error={errors.address?.message}>
          <Textarea
            {...register("address")}
            rows={2}
            placeholder="Jalan, kecamatan, kode pos, dan titik acuan kawasan..."
            className="text-xs"
          />
        </FormFieldWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldWrapper
            label="Garis Lintang (Latitude)"
            required
            error={errors.latitude?.message}
            helpText="Contoh: 3.125192 (koordinat desimal untuk Leaflet)"
          >
            <Input
              type="number"
              step="0.000001"
              {...register("latitude")}
              placeholder="3.125192"
              className="text-xs h-10"
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Garis Bujur (Longitude)"
            required
            error={errors.longitude?.message}
            helpText="Contoh: 99.349812 (koordinat desimal untuk Leaflet)"
          >
            <Input
              type="number"
              step="0.000001"
              {...register("longitude")}
              placeholder="99.349812"
              className="text-xs h-10"
            />
          </FormFieldWrapper>
        </div>
      </FormSection>

      {/* 3. Media & Dokumentasi */}
      <FormSection
        title="Dokumentasi Visual Kawasan"
        description="Tautan gambar foto utama kawasan untuk kartu direktori dan banner publik"
      >
        <ImagePreview
          value={imageUrlValue || ""}
          onChange={(url: string) => setValue("imageUrl", url, { shouldValidate: true })}
          label="Foto Utama Kawasan KEK"
          helpText="Masukkan URL gambar resmi (Unsplash, CDN portal, atau link storage)"
        />
      </FormSection>

      {/* 4. Action Buttons */}
      <FormActions
        cancelHref="/admin/kek"
        isSubmitting={isSubmitting}
        submitLabel={isEdit ? "Perbarui Data KEK" : "Simpan Kawasan Baru"}
      />
    </form>
  );
}
