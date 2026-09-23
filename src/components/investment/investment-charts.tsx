"use client";

import * as React from "react";
import { TrendingUp, Users, DollarSign, Award, Building2 } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { InvestmentOverview } from "@/lib/data/investment";

interface InvestmentChartsProps {
  data: InvestmentOverview;
}

export function InvestmentCharts({ data }: InvestmentChartsProps) {
  const { grandTotalInvestment, grandTotalEmployees, yearlyGrowth, byKek } = data;
  const [activeBarIndex, setActiveBarIndex] = React.useState<number | null>(null);

  // Maximum values for scaling charts
  const maxYearlyValue = Math.max(...yearlyGrowth.map((y) => y.totalValue), 1);
  const maxKekValue = Math.max(...byKek.slice(0, 7).map((k) => k.totalValue), 1);

  return (
    <div className="space-y-8">
      {/* 4 KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total Realisasi Investasi
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              {formatCurrency(grandTotalInvestment)}
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Akumulasi Seluruh Kawasan
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Tenaga Kerja Terserap
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              {formatNumber(grandTotalEmployees)} <span className="text-xs font-normal text-slate-500">Jiwa</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Tenaga kerja langsung</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Kawasan Terpetakan
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              {byKek.length} <span className="text-xs font-normal text-slate-500">Kawasan</span>
            </div>
            <div className="text-[10px] text-blue-600 font-medium mt-1">Sabang sampai Merauke</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Peringkat Teratas
            </div>
            <div className="text-sm font-bold text-slate-900 truncate max-w-[170px] mt-0.5">
              {byKek[0]?.name || "KEK Kendal"}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Realisasi {formatCurrency(byKek[0]?.totalValue || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Two Analytical Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Yearly Growth Chart */}
        <div className="lg:col-span-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                Tren Pertumbuhan Investasi Tahunan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Progres akumulasi modal masuk per tahun penetapan
              </p>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              Multi-Tahun
            </span>
          </div>

          {/* SVG Bar / Trend Visualization */}
          <div className="pt-4 pb-2">
            <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 border-b border-slate-200 pb-2 px-2">
              {yearlyGrowth.map((item, idx) => {
                const heightPercent = Math.max(15, Math.round((item.totalValue / maxYearlyValue) * 100));
                const isHovered = activeBarIndex === idx;

                return (
                  <div
                    key={item.year}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                    onMouseEnter={() => setActiveBarIndex(idx)}
                    onMouseLeave={() => setActiveBarIndex(null)}
                  >
                    {/* Tooltip */}
                    <div
                      className={`absolute -top-14 bg-slate-900 text-white text-[11px] rounded-lg py-1.5 px-2.5 shadow-lg whitespace-nowrap pointer-events-none transition-all duration-200 z-20 ${
                        isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                      }`}
                    >
                      <div className="font-bold">{formatCurrency(item.totalValue)}</div>
                      <div className="text-[10px] text-slate-300">
                        {formatNumber(item.totalEmployees)} tenaga kerja
                      </div>
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[48px] bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end transition-all">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          isHovered
                            ? "bg-amber-500 shadow-md shadow-amber-500/30"
                            : "bg-linear-to-t from-[#0b1f3c] to-blue-600"
                        }`}
                      />
                    </div>

                    {/* Year Label */}
                    <span
                      className={`mt-2.5 text-xs font-bold transition-colors ${
                        isHovered ? "text-amber-600" : "text-slate-600"
                      }`}
                    >
                      {item.year}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
              <span>Satuan: Triliun Rupiah (IDR)</span>
              <span>Sumber: Dewan Nasional KEK</span>
            </div>
          </div>
        </div>

        {/* Investment per KEK Breakdown */}
        <div className="lg:col-span-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              Realisasi Investasi per Kawasan (Top 7)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Peringkat penyerapan modal dan tenaga kerja tertinggi
            </p>
          </div>

          <div className="space-y-3.5">
            {byKek.slice(0, 7).map((kek, idx) => {
              const barWidth = Math.max(8, Math.round((kek.totalValue / maxKekValue) * 100));

              return (
                <div key={kek.kekId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-4 text-[11px] font-bold text-slate-400">{idx + 1}.</span>
                      <a
                        href={`/kek-indonesia/${kek.slug}`}
                        className="font-semibold text-slate-800 hover:text-blue-600 hover:underline transition-colors"
                      >
                        {kek.name}
                      </a>
                      <span className="text-[10px] text-slate-400 hidden sm:inline">({kek.province})</span>
                    </div>
                    <span className="font-bold text-slate-900">{formatCurrency(kek.totalValue)}</span>
                  </div>

                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${barWidth}%` }}
                      className={`h-full rounded-full transition-all duration-700 ${
                        idx === 0
                          ? "bg-amber-500"
                          : idx === 1
                          ? "bg-blue-600"
                          : idx === 2
                          ? "bg-emerald-600"
                          : "bg-slate-500"
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{formatNumber(kek.totalEmployees)} tenaga kerja terserap</span>
                    <span className="font-medium text-slate-600">{kek.status === "BEROPERASI" ? "Beroperasi" : "Konstruksi"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
