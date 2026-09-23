"use client";

import * as React from "react";
import Link from "next/link";
import { Lock, Unlock, ExternalLink, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ------------------------------------------------------------------------------
// 1. FormSection
// ------------------------------------------------------------------------------
export function FormSection({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-5 ${className}`}>
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// ------------------------------------------------------------------------------
// 2. FormFieldWrapper
// ------------------------------------------------------------------------------
export function FormFieldWrapper({
  label,
  required,
  error,
  helpText,
  children,
}: {
  label: string;
  required?: boolean;
  error?: unknown;
  helpText?: string;
  children: React.ReactNode;
}) {
  const errorMessage =
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message?: unknown }).message || "")
      : typeof error === "string"
      ? error
      : null;

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-700 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {helpText && !errorMessage && <p className="text-[11px] text-slate-400">{helpText}</p>}
      {errorMessage && <p className="text-[11px] text-red-500 font-medium">{errorMessage}</p>}
    </div>
  );
}

// ------------------------------------------------------------------------------
// 3. SlugInput
// ------------------------------------------------------------------------------
export function SlugInput({
  value,
  onChange,
  onGenerateFromTitle,
  error,
  prefix = "",
}: {
  value: string;
  onChange: (val: string) => void;
  onGenerateFromTitle?: () => void;
  error?: unknown;
  prefix?: string;
}) {
  const [isLocked, setIsLocked] = React.useState(true);

  return (
    <FormFieldWrapper
      label="URL Slug (Permanen / SEO)"
      required
      error={error}
      helpText="Digunakan untuk tautan halaman publik (huruf kecil, angka, dan tanda hubung)"
    >
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          {prefix && (
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-400 pointer-events-none">
              {prefix}
            </span>
          )}
          <Input
            value={value}
            disabled={isLocked}
            onChange={(e) => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
            className={`text-xs h-10 ${prefix ? "pl-16" : ""} ${
              isLocked ? "bg-slate-50 text-slate-500 cursor-not-allowed" : "bg-white"
            }`}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsLocked(!isLocked)}
          className="h-10 text-xs px-3 border-slate-200 text-slate-600 gap-1.5 shrink-0"
          title={isLocked ? "Buka kunci untuk mengedit manual" : "Kunci slug"}
        >
          {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5 text-amber-500" />}
          <span>{isLocked ? "Kunci" : "Buka"}</span>
        </Button>
        {onGenerateFromTitle && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onGenerateFromTitle}
            className="h-10 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 shrink-0"
          >
            Generate
          </Button>
        )}
      </div>
    </FormFieldWrapper>
  );
}

// ------------------------------------------------------------------------------
// 4. ImagePreview
// ------------------------------------------------------------------------------
export function ImagePreview({
  value,
  url,
  onChange,
  label = "Pratinjau Gambar",
  helpText,
  error,
}: {
  value?: string;
  url?: string | null;
  onChange?: (val: string) => void;
  label?: string;
  helpText?: string;
  error?: unknown;
}) {
  const currentUrl = value !== undefined ? value : url || "";
  const [failedUrl, setFailedUrl] = React.useState<string | null>(null);
  const hasError = failedUrl === currentUrl;

  return (
    <div className="space-y-2">
      <FormFieldWrapper label={label} error={error} helpText={helpText}>
        {onChange && (
          <Input
            value={currentUrl}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/... atau URL gambar"
            className="text-xs h-10 font-mono"
          />
        )}
      </FormFieldWrapper>

      <div className="w-full h-44 rounded-xl border border-dashed border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center relative group">
        {currentUrl && !hasError ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUrl}
              alt="Pratinjau Gambar"
              className="w-full h-full object-cover"
              onError={() => setFailedUrl(currentUrl)}
            />
            <a
              href={currentUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-1 font-semibold"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka Gambar Asli</span>
            </a>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 text-center p-4">
            <ImageIcon className="w-7 h-7 text-slate-300" />
            <span className="text-[11px]">
              {currentUrl && hasError
                ? "Gagal memuat URL gambar"
                : "Masukkan URL gambar di atas untuk melihat pratinjau"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------------------
// 5. StatusSelect
// ------------------------------------------------------------------------------
export function StatusSelect({
  value,
  onChange,
  label = "Status Publikasi",
  options = [
    { value: "DRAFT", label: "Draft (Belum Ditampilkan)" },
    { value: "PUBLISHED", label: "Published (Aktif di Website)" },
    { value: "ARCHIVED", label: "Archived (Diarsipkan)" },
  ],
}: {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  options?: { value: string; label: string }[];
}) {
  return (
    <FormFieldWrapper label={label} required>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-xs h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormFieldWrapper>
  );
}

// ------------------------------------------------------------------------------
// 6. FormActions
// ------------------------------------------------------------------------------
export function FormActions({
  backHref,
  cancelHref,
  isSubmitting,
  submitLabel = "Simpan Data",
}: {
  backHref?: string;
  cancelHref?: string;
  isSubmitting: boolean;
  submitLabel?: string;
}) {
  const targetHref = cancelHref || backHref || "/admin";

  return (
    <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-200">
      <Link href={targetHref}>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          className="text-xs h-10 px-5 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          Batal
        </Button>
      </Link>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="text-xs h-10 px-6 rounded-xl font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-xs gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Menyimpan...</span>
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );
}
