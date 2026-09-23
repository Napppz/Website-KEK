"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldValues, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { investmentSchema, type InvestmentInput } from "@/lib/validations/investment";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormSection,
  FormFieldWrapper,
  FormActions,
} from "./form-components";
import { Users } from "lucide-react";

interface InvestmentFormProps {
  initialData?: Partial<InvestmentInput> & { id?: string };
  isEdit?: boolean;
}

interface KekOption {
  id: string;
  name: string;
  focus: string;
}

export function InvestmentForm({ initialData, isEdit = false }: InvestmentFormProps) {
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
    resolver: zodResolver(investmentSchema) as unknown as Resolver<FieldValues>,
    defaultValues: {
      kekId: initialData?.kekId || "",
      year: initialData?.year || new Date().getFullYear(),
      investmentValue: initialData?.investmentValue ? Number(initialData.investmentValue) : 0,
      employeeCount: initialData?.employeeCount ? Number(initialData.employeeCount) : 0,
      description: initialData?.description || "",
    },
  });

  const kekIdValue = watch("kekId");
  const valueNumber = watch("investmentValue");

  React.useEffect(() => {
    async function loadKeks() {
      try {
        const res = await fetch("/api/kek");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setKeks(json.data);
          if (!initialData?.kekId && json.data.length > 0) {
            setValue("kekId", json.data[0].id);
          }
        }
      } catch (err) {
        console.error("Gagal memuat daftar KEK:", err);
      }
    }
    loadKeks();
  }, [initialData?.kekId, setValue]);

  // Format currency preview helper
  const formattedRupiah = React.useMemo(() => {
    const val = Number(valueNumber) || 0;
    if (val >= 1_000_000_000_000) {
      return `Rp ${(val / 1_000_000_000_000).toFixed(2)} Triliun`;
    }
    if (val >= 1_000_000_000) {
      return `Rp ${(val / 1_000_000_000).toFixed(2)} Miliar`;
    }
    return `Rp ${val.toLocaleString("id-ID")}`;
  }, [valueNumber]);

  const onSubmit = async (data: FieldValues) => {
    setIsSubmitting(true);
    try {
      const url = isEdit && initialData?.id ? `/api/investasi/${initialData.id}` : "/api/investasi";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan data investasi");
      }

      addToast({
        title: isEdit ? "Investasi Diperbarui" : "Investasi Dicatat",
        description: isEdit
          ? "Data realisasi investasi kawasan berhasil diperbarui."
          : "Capaian realisasi modal dan serapan tenaga kerja berhasil dicatat.",
        type: "success",
      });

      router.push("/admin/investasi");
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
      {/* 1. Informasi Capaian Investasi */}
      <FormSection
        title="Realisasi Investasi Kawasan"
        description="Pilih entitas KEK, tahun pencatatan capaian, dan nominal modal yang terserap"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldWrapper label="Kawasan Ekonomi Khusus" required error={errors.kekId?.message}>
            <select
              value={kekIdValue}
              onChange={(e) => setValue("kekId", e.target.value, { shouldValidate: true })}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent font-medium"
            >
              <option value="" disabled>
                -- Pilih Kawasan KEK --
              </option>
              {keks.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name} ({k.focus})
                </option>
              ))}
            </select>
          </FormFieldWrapper>

          <FormFieldWrapper label="Tahun Periode Realisasi" required error={errors.year?.message}>
            <Input
              type="number"
              {...register("year")}
              placeholder="2024"
              className="text-xs h-10"
            />
          </FormFieldWrapper>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldWrapper
            label="Nilai Realisasi Investasi (IDR)"
            required
            error={errors.investmentValue?.message}
            helpText={`Nominal penuh Rupiah. Pratinjau: ${formattedRupiah}`}
          >
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-slate-400 pointer-events-none">
                Rp
              </span>
              <Input
                type="number"
                step="1000000"
                {...register("investmentValue")}
                placeholder="15000000000000"
                className="text-xs h-10 pl-9 font-semibold text-slate-900"
              />
            </div>
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Jumlah Serapan Tenaga Kerja (Jiwa)"
            required
            error={errors.employeeCount?.message}
            helpText="Jumlah akumulasi tenaga kerja langsung yang terserap"
          >
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-400 pointer-events-none">
                <Users className="w-3.5 h-3.5" />
              </span>
              <Input
                type="number"
                {...register("employeeCount")}
                placeholder="4500"
                className="text-xs h-10 pl-9 font-semibold text-slate-900"
              />
            </div>
          </FormFieldWrapper>
        </div>

        <FormFieldWrapper
          label="Keterangan & Rincian Investor / Proyek Utama"
          error={errors.description?.message}
          helpText="Daftar tenant investor terdaftar, pembangunan smelter, pabrik, atau proyek ekspansi"
        >
          <Textarea
            {...register("description")}
            rows={4}
            placeholder="Tuliskan nama perusahaan investor dan fasilitas industri yang dibangun..."
            className="text-xs"
          />
        </FormFieldWrapper>
      </FormSection>

      {/* 2. Action Buttons */}
      <FormActions
        cancelHref="/admin/investasi"
        isSubmitting={isSubmitting}
        submitLabel={isEdit ? "Perbarui Data Investasi" : "Catat Realisasi Investasi"}
      />
    </form>
  );
}
