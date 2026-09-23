"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldValues, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsSchema, type NewsInput } from "@/lib/validations/news";
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

interface NewsFormProps {
  initialData?: Partial<NewsInput> & { id?: string };
  isEdit?: boolean;
}

interface CategoryOption {
  id: string;
  name: string;
}

interface KekOption {
  id: string;
  name: string;
}

export function NewsForm({ initialData, isEdit = false }: NewsFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [categories, setCategories] = React.useState<CategoryOption[]>([]);
  const [keks, setKeks] = React.useState<KekOption[]>([]);

  // Format initial publishedAt for datetime-local or date input
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
    resolver: zodResolver(newsSchema) as unknown as Resolver<FieldValues>,
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      thumbnailUrl: initialData?.thumbnailUrl || "",
      categoryId: initialData?.categoryId || "",
      kekId: initialData?.kekId || null,
      status: (initialData?.status as "DRAFT" | "PUBLISHED" | "ARCHIVED") || "DRAFT",
      publishedAt: initialData?.publishedAt ? new Date(initialData.publishedAt) : new Date(),
    },
  });

  const titleValue = watch("title");
  const slugValue = watch("slug");
  const thumbnailUrlValue = watch("thumbnailUrl");
  const statusValue = watch("status");
  const categoryIdValue = watch("categoryId");
  const kekIdValue = watch("kekId");

  React.useEffect(() => {
    async function loadDropdowns() {
      try {
        const [catRes, kekRes] = await Promise.all([
          fetch("/api/kategori-berita"),
          fetch("/api/kek"),
        ]);
        const catJson = await catRes.json();
        const kekJson = await kekRes.json();

        if (catJson.success && Array.isArray(catJson.data)) {
          setCategories(catJson.data);
          if (!initialData?.categoryId && catJson.data.length > 0) {
            setValue("categoryId", catJson.data[0].id);
          }
        }
        if (kekJson.success && Array.isArray(kekJson.data)) {
          setKeks(kekJson.data);
        }
      } catch (err) {
        console.error("Gagal memuat kategori atau KEK:", err);
      }
    }
    loadDropdowns();
  }, [initialData?.categoryId, setValue]);

  const generateSlugFromTitle = () => {
    if (!titleValue) return;
    const generated = titleValue
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
      const url = isEdit && initialData?.id ? `/api/berita/${initialData.id}` : "/api/berita";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan artikel berita");
      }

      addToast({
        title: isEdit ? "Berita Diperbarui" : "Berita Diterbitkan",
        description: isEdit
          ? `Artikel "${data.title}" berhasil diperbarui.`
          : `Artikel "${data.title}" berhasil disimpan ke sistem.`,
        type: "success",
      });

      router.push("/admin/berita");
      router.refresh();
    } catch (err) {
      addToast({
        title: "Penyimpanan Gagal",
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan berita.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      {/* 1. Header Konten */}
      <FormSection
        title="Informasi & Judul Berita"
        description="Tajuk utama, URL tautan slug publik, serta ringkasan kutipan artikel"
      >
        <FormFieldWrapper label="Judul Artikel Berita" required error={errors.title?.message}>
          <Input
            {...register("title")}
            placeholder="Contoh: KEK Sei Mangkei Capai Realisasi Investasi Rp 12 Triliun pada Kuartal II"
            className="text-xs h-10 font-medium"
          />
        </FormFieldWrapper>

        <SlugInput
          value={slugValue}
          onChange={(val) => setValue("slug", val, { shouldValidate: true })}
          onGenerateFromTitle={generateSlugFromTitle}
          error={errors.slug?.message}
          prefix="/berita/"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldWrapper
            label="Kategori Berita"
            required
            error={errors.categoryId?.message}
          >
            <select
              value={categoryIdValue}
              onChange={(e) => setValue("categoryId", e.target.value, { shouldValidate: true })}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="" disabled>
                -- Pilih Kategori --
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Terkait Kawasan KEK (Opsional)"
            helpText="Pilih jika artikel ini spesifik membahas satu kawasan"
          >
            <select
              value={kekIdValue || ""}
              onChange={(e) => setValue("kekId", e.target.value ? e.target.value : null)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="">-- Umum / Semua Kawasan --</option>
              {keks.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </select>
          </FormFieldWrapper>
        </div>

        <FormFieldWrapper
          label="Ringkasan Singkat (Excerpt)"
          required
          error={errors.excerpt?.message}
          helpText="Teks ringkas 1-2 kalimat untuk pratinjau kartu berita dan metadata SEO"
        >
          <Textarea
            {...register("excerpt")}
            rows={3}
            placeholder="Tuliskan intisari informasi berita ini..."
            className="text-xs"
          />
        </FormFieldWrapper>
      </FormSection>

      {/* 2. Isi Lengkap Berita */}
      <FormSection
        title="Isi Tubuh Artikel Berita"
        description="Konten naskah lengkap berita yang akan ditampilkan kepada publik"
      >
        <FormFieldWrapper
          label="Konten Naskah Berita"
          required
          error={errors.content?.message}
          helpText="Dapat menyertakan beberapa paragraf naskah siaran pers resmi"
        >
          <Textarea
            {...register("content")}
            rows={10}
            placeholder="Tulis naskah lengkap berita di sini..."
            className="text-xs leading-relaxed"
          />
        </FormFieldWrapper>
      </FormSection>

      {/* 3. Media & Pengaturan Publikasi */}
      <FormSection
        title="Thumbnail & Publikasi"
        description="Gambar sampul berita serta status rilis artikel"
      >
        <ImagePreview
          value={thumbnailUrlValue || ""}
          onChange={(url: string) => setValue("thumbnailUrl", url, { shouldValidate: true })}
          label="Foto Sampul (Thumbnail)"
          helpText="Masukkan URL foto resolusi tinggi untuk banner artikel"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <StatusSelect
            value={statusValue}
            onChange={(val) =>
              setValue("status", val as "DRAFT" | "PUBLISHED" | "ARCHIVED", {
                shouldValidate: true,
              })
            }
            options={[
              { label: "Draft (Simpan sebagai konsep)", value: "DRAFT" },
              { label: "Published (Terbitkan ke portal publik)", value: "PUBLISHED" },
              { label: "Archived (Arsipkan / Non-aktif)", value: "ARCHIVED" },
            ]}
            label="Status Publikasi"
          />

          <FormFieldWrapper
            label="Tanggal Rilis Publikasi"
            helpText="Tanggal yang ditampilkan pada label siaran pers"
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
      </FormSection>

      {/* 4. Action Buttons */}
      <FormActions
        cancelHref="/admin/berita"
        isSubmitting={isSubmitting}
        submitLabel={isEdit ? "Perbarui Artikel Berita" : "Simpan & Publikasikan Berita"}
      />
    </form>
  );
}
