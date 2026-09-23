"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

export interface ConfirmDialogProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default" | "primary";
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  open,
  isOpen,
  onOpenChange,
  onClose,
  title,
  description,
  confirmLabel = "Ya, Lanjutkan",
  cancelLabel = "Batal",
  variant = "danger",
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const isDialogOpen = open !== undefined ? open : !!isOpen;

  const handleOpenChange = (state: boolean) => {
    if (onOpenChange) onOpenChange(state);
    if (!state && onClose) onClose();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          iconBox: "bg-red-50 text-red-600 border border-red-200",
          btnColor: "bg-red-600 hover:bg-red-700 text-white",
        };
      case "warning":
        return {
          iconBox: "bg-amber-50 text-amber-600 border border-amber-200",
          btnColor: "bg-amber-600 hover:bg-amber-700 text-white",
        };
      case "primary":
        return {
          iconBox: "bg-blue-50 text-blue-600 border border-blue-200",
          btnColor: "bg-blue-700 hover:bg-blue-800 text-white",
        };
      default:
        return {
          iconBox: "bg-slate-100 text-slate-700 border border-slate-200",
          btnColor: "bg-slate-900 hover:bg-slate-800 text-white",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md p-6 bg-white rounded-2xl shadow-2xl border border-slate-200">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${styles.iconBox}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 leading-tight">
                {title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-1 leading-relaxed">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="mt-6 flex flex-row items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={() => handleOpenChange(false)}
            className="text-xs h-9 px-4 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isLoading}
            onClick={onConfirm}
            className={`text-xs h-9 px-5 rounded-xl font-bold gap-2 ${styles.btnColor}`}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
