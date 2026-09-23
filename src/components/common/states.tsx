import * as React from "react";
import Link from "next/link";
import { Loader2, Inbox, AlertTriangle, RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoadingState({ message = "Memuat data portal..." }: { message?: string }) {
  return (
    <div className="py-20 flex flex-col items-center justify-center space-y-4 text-center">
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-700">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}

export function EmptyState({
  title = "Data tidak ditemukan",
  description = "Periksa kembali kata kunci atau filter yang digunakan.",
  actionText = "Reset Filter",
  actionHref,
  onAction,
}: {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}) {
  return (
    <div className="py-16 px-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 flex flex-col items-center justify-center text-center space-y-3">
      <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200 text-slate-400 flex items-center justify-center">
        <Inbox className="w-7 h-7 text-slate-400" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 max-w-md leading-relaxed">{description}</p>
      
      {actionHref ? (
        <Link href={actionHref}>
          <Button variant="outline" size="sm" className="mt-2 text-xs font-semibold gap-1.5 bg-white border-slate-300 hover:bg-slate-100">
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            {actionText}
          </Button>
        </Link>
      ) : actionText && onAction ? (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-2 text-xs font-semibold gap-1.5 bg-white border-slate-300 hover:bg-slate-100">
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          {actionText}
        </Button>
      ) : null}
    </div>
  );
}

export function ErrorState({
  title = "Terjadi Kesalahan Sistem",
  description = "Gagal memproses data. Silakan coba muat ulang halaman.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="py-16 px-4 rounded-2xl border border-red-200 bg-red-50/40 flex flex-col items-center justify-center text-center space-y-3">
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-red-900">{title}</h3>
      <p className="text-xs text-red-700 max-w-sm leading-relaxed">{description}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-2 text-xs gap-1.5 border-red-300 text-red-800 hover:bg-red-100"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Muat Ulang
        </Button>
      )}
    </div>
  );
}
