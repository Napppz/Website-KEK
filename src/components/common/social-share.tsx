"use client";

import * as React from "react";
import { Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialShareProps {
  title: string;
  className?: string;
}

export function SocialShare({ title, className = "" }: SocialShareProps) {
  const [copied, setCopied] = React.useState(false);

  const handleShare = (platform: "wa" | "x" | "fb") => {
    if (typeof window === "undefined") return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Kunjungi: ${title} - Portal Resmi KEK Republik Indonesia`);

    let shareUrl = "";
    if (platform === "wa") {
      shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
    } else if (platform === "x") {
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    } else if (platform === "fb") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopy = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className={`p-4 rounded-xl border border-slate-200 bg-slate-50/80 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Share2 className="w-4 h-4 text-amber-600" />
          <span>Bagikan Halaman Ini:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleShare("wa")}
            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md border bg-white transition-all shadow-xs hover:bg-emerald-600 hover:text-white border-emerald-200 text-emerald-700 cursor-pointer"
            aria-label="Bagikan ke WhatsApp"
          >
            WhatsApp
          </button>

          <button
            type="button"
            onClick={() => handleShare("x")}
            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md border bg-white transition-all shadow-xs hover:bg-slate-900 hover:text-white border-slate-300 text-slate-800 cursor-pointer"
            aria-label="Bagikan ke X"
          >
            X (Twitter)
          </button>

          <button
            type="button"
            onClick={() => handleShare("fb")}
            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md border bg-white transition-all shadow-xs hover:bg-blue-600 hover:text-white border-blue-200 text-blue-700 cursor-pointer"
            aria-label="Bagikan ke Facebook"
          >
            Facebook
          </button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2.5 text-xs gap-1.5 bg-white border-slate-300 hover:bg-slate-100"
            aria-label="Salin Tautan Halaman"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-medium">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Salin Tautan</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
