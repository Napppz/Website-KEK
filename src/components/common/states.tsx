import * as React from "react";
import { Loader2, Inbox, AlertTriangle, RefreshCw } from "lucide-react";
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
  title = "Tidak ada data yang ditemukan",
  description = "Silakan coba ubah kata kunci pencarian atau filter yang Anda gunakan.",
  actionText,
  onAction,
}: {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}) {
  return (
    <div className="py-16 px-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-3">
      <div className="w-12 h-12 rounded-full bg-slate-200/70 text-slate-500 flex items-center justify-center">
        <Inbox className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-2 text-xs">
          {actionText}
        </Button>
      )}
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
    <div className="py-16 px-4 rounded-xl border border-red-200 bg-red-50/40 flex flex-col items-center justify-center text-center space-y-3">
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
