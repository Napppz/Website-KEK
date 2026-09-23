"use client";

import * as React from "react";
import { Building2, TrendingUp, PieChart, Newspaper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ------------------------------------------------------------------------------
// 1. KEK PROVINCE DISTRIBUTION CHART (Horizontal Progress / Bar)
// ------------------------------------------------------------------------------
interface ProvinceData {
  province: string;
  count: number;
}

export function KekProvinceChart({ data }: { data: ProvinceData[] }) {
  const sorted = [...data].sort((a, b) => b.count - a.count).slice(0, 6);
  const max = Math.max(...sorted.map((d) => d.count), 1);

  return (
    <Card className="border-slate-200 shadow-xs">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            Distribusi KEK Berdasarkan Provinsi
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Sebaran lokasi kawasan ekonomi khusus terbanyak</p>
        </div>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">Belum ada data persebaran KEK</div>
        ) : (
          <div className="space-y-3.5 pt-2">
            {sorted.map((item, idx) => {
              const percentage = Math.round((item.count / max) * 100);
              const colorPalette = [
                "bg-blue-600",
                "bg-emerald-600",
                "bg-amber-500",
                "bg-indigo-600",
                "bg-cyan-600",
                "bg-pink-600",
              ];
              const barColor = colorPalette[idx % colorPalette.length];

              return (
                <div key={item.province} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-700 truncate max-w-[200px]">
                      {item.province}
                    </span>
                    <span className="font-bold text-slate-900">{item.count} Kawasan</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${Math.max(percentage, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ------------------------------------------------------------------------------
// 2. KEK STATUS DONUT CHART (SVG Donut)
// ------------------------------------------------------------------------------
interface StatusData {
  beroperasi: number;
  tahapPembangunan: number;
}

export function KekStatusDonutChart({ data }: { data: StatusData }) {
  const total = data.beroperasi + data.tahapPembangunan;
  const beroperasiPct = total > 0 ? (data.beroperasi / total) * 100 : 50;

  return (
    <Card className="border-slate-200 shadow-xs">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-600" />
            Status Operasional KEK
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Perbandingan tahapan beroperasi vs pembangunan</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
          {/* SVG Donut */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              {/* Background circle (Pembangunan) */}
              <circle
                cx="18"
                cy="18"
                r="15.91549430918954"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="4.2"
                strokeDasharray="100 0"
              />
              {/* Foreground circle (Beroperasi) */}
              <circle
                cx="18"
                cy="18"
                r="15.91549430918954"
                fill="none"
                stroke="#10b981"
                strokeWidth="4.2"
                strokeDasharray={`${beroperasiPct} ${100 - beroperasiPct}`}
                strokeDashoffset="0"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-900">{total}</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Total KEK
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-md bg-emerald-500 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {data.beroperasi} Kawasan ({total > 0 ? Math.round((data.beroperasi / total) * 100) : 0}%)
                </div>
                <div className="text-[11px] text-slate-500">Beroperasi Penuh</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-md bg-amber-500 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {data.tahapPembangunan} Kawasan (
                  {total > 0 ? Math.round((data.tahapPembangunan / total) * 100) : 0}%)
                </div>
                <div className="text-[11px] text-slate-500">Tahap Pembangunan</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ------------------------------------------------------------------------------
// 3. INVESTMENT SECTOR CHART (Bar Chart)
// ------------------------------------------------------------------------------
interface SectorData {
  sector: string;
  valueTrillion: number;
}

export function InvestmentSectorChart({ data }: { data: SectorData[] }) {
  const max = Math.max(...data.map((d) => d.valueTrillion), 1);

  return (
    <Card className="border-slate-200 shadow-xs">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            Realisasi Investasi per Sektor
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Nilai realisasi investasi dalam Triliun Rupiah (IDR)</p>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">Belum ada data investasi sektor</div>
        ) : (
          <div className="space-y-3.5 pt-2">
            {data.map((item) => {
              const pct = Math.round((item.valueTrillion / max) * 100);

              return (
                <div key={item.sector} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-700">{item.sector}</span>
                    <span className="font-bold text-indigo-700">Rp {item.valueTrillion.toFixed(1)} T</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                      style={{ width: `${Math.max(pct, 10)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ------------------------------------------------------------------------------
// 4. NEWS PUBLICATION TREND CHART (SVG Area / Sparkline Grid)
// ------------------------------------------------------------------------------
interface TrendData {
  month: string;
  count: number;
}

export function NewsTrendsChart({ data }: { data: TrendData[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <Card className="border-slate-200 shadow-xs">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-emerald-600" />
            Tren Publikasi Berita Kawasan
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Jumlah rilis berita dan siaran pers 6 bulan terakhir</p>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">Belum ada riwayat publikasi berita</div>
        ) : (
          <div className="pt-4 pb-2">
            {/* Column Bars */}
            <div className="grid grid-cols-6 items-end gap-3 h-36 px-2 border-b border-slate-100 pb-2">
              {data.map((item) => {
                const heightPct = Math.round((item.count / max) * 100);
                return (
                  <div key={item.month} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count}
                    </span>
                    <div className="w-full max-w-[28px] bg-slate-100 rounded-t-md overflow-hidden flex flex-col justify-end h-full">
                      <div
                        className="w-full bg-emerald-500 hover:bg-emerald-600 transition-all rounded-t-md"
                        style={{ height: `${Math.max(heightPct, 15)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-medium text-slate-500">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
