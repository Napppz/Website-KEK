"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

export interface ToastOptions {
  title?: string;
  description?: string;
  message?: string;
  type?: ToastType;
}

interface ToastContextType {
  toast: (messageOrOptions: string | ToastOptions, type?: ToastType, title?: string) => void;
  addToast: (options: ToastOptions) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const addToastItem = React.useCallback(
    (message: string, type: ToastType = "success", title?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setToasts((prev) => [...prev, { id, type, title, message }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const addToast = React.useCallback(
    (opts: ToastOptions) => {
      const msg = opts.description || opts.message || opts.title || "";
      addToastItem(msg, opts.type || "success", opts.title);
    },
    [addToastItem]
  );

  const toast = React.useCallback(
    (messageOrOptions: string | ToastOptions, type: ToastType = "success", title?: string) => {
      if (typeof messageOrOptions === "object") {
        addToast(messageOrOptions);
      } else {
        addToastItem(messageOrOptions, type, title);
      }
    },
    [addToast, addToastItem]
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const contextValue = React.useMemo(
    () => ({
      toast,
      addToast,
      success: (msg: string, title?: string) => addToastItem(msg, "success", title),
      error: (msg: string, title?: string) => addToastItem(msg, "error", title),
      info: (msg: string, title?: string) => addToastItem(msg, "info", title),
    }),
    [toast, addToast, addToastItem]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast Overlay Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all animate-in slide-in-from-bottom-2 ${
              t.type === "success"
                ? "bg-white border-emerald-200 text-slate-800"
                : t.type === "error"
                ? "bg-white border-red-200 text-slate-800"
                : "bg-white border-blue-200 text-slate-800"
            }`}
          >
            {t.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            )}
            {t.type === "error" && (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            {t.type === "info" && (
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 space-y-0.5">
              {t.title && <h4 className="text-xs font-bold text-slate-900">{t.title}</h4>}
              <p className="text-xs text-slate-600">{t.message}</p>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
