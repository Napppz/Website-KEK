"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().min(3, { message: "Nama lengkap minimal 3 karakter" }),
  email: z.string().email({ message: "Format alamat email tidak valid" }),
  subject: z.string().min(5, { message: "Subjek pertanyaan minimal 5 karakter" }),
  message: z.string().min(15, { message: "Pesan atau pertanyaan minimal 15 karakter" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    void data;
    // Simulasi pengiriman request formulir
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
      {isSuccess ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              Pesan Konsultasi Terkirim!
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Terima kasih telah menghubungi helpdesk KEK Indonesia. Tim layanan investasi kami akan meninjau pertanyaan Anda dan membalas melalui email secepatnya.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSuccess(false)}
            className="text-xs mt-2"
          >
            Kirim Pesan Lainnya
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              Formulir Konsultasi & Pengaduan
            </h3>
            <p className="text-xs text-slate-500">
              Sampaikan pertanyaan mengenai regulasi, fasilitasi insentif fiskal, atau prosedur berinvestasi.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="text-xs font-semibold text-slate-700 block mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                placeholder="Contoh: Budi Santoso"
                {...register("name")}
                className={errors.name ? "border-red-400 focus-visible:ring-red-400" : ""}
              />
              {errors.name && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="text-xs font-semibold text-slate-700 block mb-1">
                Alamat Email Perusahaan / Pribadi <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder="nama@perusahaan.co.id"
                {...register("email")}
                className={errors.email ? "border-red-400 focus-visible:ring-red-400" : ""}
              />
              {errors.email && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="subject" className="text-xs font-semibold text-slate-700 block mb-1">
                Subjek Pertanyaan <span className="text-red-500">*</span>
              </label>
              <Input
                id="subject"
                placeholder="Contoh: Permohonan Asistensi Fasilitas Tax Holiday KEK Kendal"
                {...register("subject")}
                className={errors.subject ? "border-red-400 focus-visible:ring-red-400" : ""}
              />
              {errors.subject && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="text-xs font-semibold text-slate-700 block mb-1">
                Rincian Pesan / Kebutuhan Informasi <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="Tuliskan secara lengkap rincian pertanyaan atau kebutuhan koordinasi investasi Anda..."
                {...register("message")}
                className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  errors.message ? "border-red-400 focus-visible:ring-red-400" : ""
                }`}
              />
              {errors.message && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.message.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 gap-2 font-bold bg-[#0f284e] hover:bg-[#1a3b6b]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mengirimkan Pesan...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-amber-400" />
                <span>Kirim Formulir Konsultasi</span>
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
