"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { kekSchema, type KekInput } from "@/lib/validations/kek";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface KekData {
  id: string;
  name: string;
  slug: string;
  province: string;
  city: string;
  address?: string | null;
  area: number;
  focus: string;
  status: "BEROPERASI" | "TAHAP_PEMBANGUNAN";
  description?: string | null;
  latitude: number;
  longitude: number;
  imageUrl?: string | null;
}

interface KekDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: KekData | null;
  onSuccess: () => void;
}

export function KekDialog({ open, onOpenChange, initialData, onSuccess }: KekDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<KekInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(kekSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      province: initialData?.province || "",
      city: initialData?.city || "",
      address: initialData?.address || "",
      area: initialData?.area || 100,
      focus: initialData?.focus || "",
      status: initialData?.status || "TAHAP_PEMBANGUNAN",
      description: initialData?.description || "",
      latitude: initialData?.latitude || -6.2,
      longitude: initialData?.longitude || 106.81,
      imageUrl: initialData?.imageUrl || "",
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        slug: initialData.slug || "",
        province: initialData.province || "",
        city: initialData.city || "",
        address: initialData.address || "",
        area: initialData.area || 100,
        focus: initialData.focus || "",
        status: initialData.status || "TAHAP_PEMBANGUNAN",
        description: initialData.description || "",
        latitude: initialData.latitude || -6.2,
        longitude: initialData.longitude || 106.81,
        imageUrl: initialData.imageUrl || "",
      });
    } else {
      reset({
        name: "",
        slug: "",
        province: "",
        city: "",
        address: "",
        area: 100,
        focus: "",
        status: "TAHAP_PEMBANGUNAN",
        description: "",
        latitude: -6.2,
        longitude: 106.81,
        imageUrl: "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: KekInput) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const url = initialData ? `/api/kek/${initialData.id}` : "/api/kek";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan data KEK.");
      }

      onSuccess();
      onOpenChange(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan data.";
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
            {initialData ? "Edit Kawasan KEK" : "Tambah KEK Baru"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Isi formulir spesifikasi entitas Kawasan Ekonomi Khusus.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-medium border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Nama Kawasan</label>
              <Input
                placeholder="Contoh: KEK Sei Mangkei"
                {...register("name")}
                className="text-xs h-9"
              />
              {errors.name && <p className="text-[11px] text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">URL Slug</label>
              <Input
                placeholder="sei-mangkei"
                {...register("slug")}
                className="text-xs h-9"
              />
              {errors.slug && <p className="text-[11px] text-red-500">{errors.slug.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Provinsi</label>
              <Input
                placeholder="Sumatera Utara"
                {...register("province")}
                className="text-xs h-9"
              />
              {errors.province && <p className="text-[11px] text-red-500">{errors.province.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Kabupaten/Kota</label>
              <Input
                placeholder="Simalungun"
                {...register("city")}
                className="text-xs h-9"
              />
              {errors.city && <p className="text-[11px] text-red-500">{errors.city.message}</p>}
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Alamat Lengkap</label>
              <Input
                placeholder="Jl. Raya KEK No. 1, Kab. ..."
                {...register("address")}
                className="text-xs h-9"
              />
              {errors.address && <p className="text-[11px] text-red-500">{errors.address.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Luas (Hektar)</label>
              <Input
                type="number"
                step="0.1"
                {...register("area", { valueAsNumber: true })}
                className="text-xs h-9"
              />
              {errors.area && <p className="text-[11px] text-red-500">{errors.area.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Status Operasional</label>
              <select
                {...register("status")}
                className="w-full h-9 rounded-md border border-slate-300 px-3 text-xs bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="BEROPERASI">Beroperasi</option>
                <option value="TAHAP_PEMBANGUNAN">Tahap Pembangunan</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Latitude (Koordinat GIS)</label>
              <Input
                type="number"
                step="0.0001"
                {...register("latitude", { valueAsNumber: true })}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Longitude (Koordinat GIS)</label>
              <Input
                type="number"
                step="0.0001"
                {...register("longitude", { valueAsNumber: true })}
                className="text-xs h-9"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Sektor Fokus Utama</label>
            <Input
              placeholder="Industri Kelapa Sawit, Karet, dan Logistik"
              {...register("focus")}
              className="text-xs h-9"
            />
            {errors.focus && <p className="text-[11px] text-red-500">{errors.focus.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">URL Gambar Thumbnail</label>
            <Input
              placeholder="https://images.unsplash.com/photo-..."
              {...register("imageUrl")}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Deskripsi Lengkap</label>
            <textarea
              rows={3}
              {...register("description")}
              placeholder="Deskripsi singkat kawasan..."
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
              {isSubmitting ? "Menyimpan..." : "Simpan Data KEK"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
