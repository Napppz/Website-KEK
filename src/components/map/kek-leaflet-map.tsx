"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { KekWithDetails } from "@/lib/data/kek";

const DynamicLeafletMap = dynamic(
  () => import("./kek-leaflet-inner"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[450px] sm:h-[520px] rounded-xl border border-slate-200 bg-slate-100 flex flex-col items-center justify-center space-y-3 text-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700">Memuat Peta Persebaran KEK...</p>
          <p className="text-xs text-slate-400">Menghubungkan data geospasial Indonesia</p>
        </div>
      </div>
    ),
  }
);

export function KekLeafletMap({ keks }: { keks: KekWithDetails[] }) {
  return <DynamicLeafletMap keks={keks} />;
}
