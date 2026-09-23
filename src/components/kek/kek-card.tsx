import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, Layers, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { KekWithDetails } from "@/lib/data/kek";

export interface KekCardProps {
  kek: KekWithDetails;
  featured?: boolean;
}

export function KekCard({ kek, featured = false }: KekCardProps) {
  const isOperating = kek.status === "BEROPERASI";
  const defaultImage =
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80";

  return (
    <Card className="group overflow-hidden flex flex-col h-full bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-lg transition-all duration-300">
      {/* Image Container */}
      <div className="relative w-full h-52 overflow-hidden bg-slate-100">
        <Image
          src={kek.imageUrl || defaultImage}
          alt={`Kawasan Ekonomi Khusus ${kek.name}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant={isOperating ? "emerald" : "amber"}
            className="text-[11px] font-bold shadow-xs py-0.5 px-2.5 backdrop-blur-xs"
          >
            {isOperating ? "Kawasan Beroperasi" : "Tahap Pembangunan"}
          </Badge>
        </div>

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-3 right-3">
            <Badge
              variant="blue"
              className="text-[10px] font-bold shadow-xs py-0.5 px-2 backdrop-blur-xs flex items-center gap-1 bg-[#0b1f3c]/90 text-amber-300 border-amber-400/40"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              Unggulan
            </Badge>
          </div>
        )}

        {/* Province Tag */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <span className="inline-flex items-center gap-1 font-medium bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            {kek.province}
          </span>
          <span className="text-[11px] text-slate-200 font-semibold bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-xs">
            {kek.area} Ha
          </span>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
            {kek.name}
          </h3>

          <div className="flex items-start gap-1.5 text-xs text-slate-600">
            <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span className="line-clamp-1 font-medium">
              <strong className="text-slate-700">Fokus:</strong> {kek.focus}
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
            {kek.description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            {kek.city}
          </div>

          <Link href={`/kek-indonesia/${kek.slug}`}>
            <Button
              variant="default"
              size="sm"
              className="text-xs h-8 px-3 gap-1.5 font-semibold group/btn bg-[#0f284e] hover:bg-[#1a3b6b]"
            >
              Lihat Detail
              <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
