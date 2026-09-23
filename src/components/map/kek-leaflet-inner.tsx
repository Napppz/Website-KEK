"use client";

import * as React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { KekWithDetails } from "@/lib/data/kek";

export interface KekLeafletInnerProps {
  keks: KekWithDetails[];
}

export default function KekLeafletInner({ keks }: KekLeafletInnerProps) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<L.Map | null>(null);

  React.useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Inisialisasi peta berpusat di kepulauan Indonesia
    const map = L.map(mapContainerRef.current, {
      center: [-0.7893, 117.9213], // Titik tengah geografis Indonesia
      zoom: 5,
      minZoom: 4,
      maxZoom: 14,
      scrollWheelZoom: false, // cegah scroll halaman sengaja terperangkap
    });

    mapInstanceRef.current = map;

    // TileLayer CartoDB Positron / OSM yang bersih dan profesional
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    // Buat Custom Marker Icon berdesain institusional
    const createCustomIcon = (isOperating: boolean) => {
      const color = isOperating ? "#059669" : "#d97706";
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="28" height="36">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12z" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
          <circle cx="12" cy="12" r="5" fill="#ffffff"/>
        </svg>
      `;
      return L.divIcon({
        className: "custom-leaflet-marker",
        html: svg,
        iconSize: [28, 36],
        iconAnchor: [14, 36],
        popupAnchor: [0, -32],
      });
    };

    // Tambahkan marker untuk setiap KEK
    keks.forEach((kek) => {
      if (!kek.latitude || !kek.longitude) return;

      const isOperating = kek.status === "BEROPERASI";
      const marker = L.marker([kek.latitude, kek.longitude], {
        icon: createCustomIcon(isOperating),
      }).addTo(map);

      const statusBadge = isOperating
        ? '<span style="background-color:#ecfdf5;color:#047857;padding:2px 8px;border-radius:9999px;font-size:10px;font-weight:700;border:1px solid #a7f3d0;">Beroperasi</span>'
        : '<span style="background-color:#fffbeb;color:#b45309;padding:2px 8px;border-radius:9999px;font-size:10px;font-weight:700;border:1px solid #fde68a;">Tahap Pembangunan</span>';

      const popupContent = `
        <div style="font-family: inherit; padding: 4px 2px; max-width: 240px;">
          <div style="margin-bottom: 6px;">${statusBadge}</div>
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 800; color: #0f284e; line-height: 1.2;">${kek.name}</h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b;">${kek.city}, ${kek.province}</p>
          <div style="margin: 6px 0; font-size: 11px; color: #334155; line-height: 1.3;">
            <strong>Fokus:</strong> ${kek.focus}
          </div>
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e2e8f0;">
            <a href="/kek-indonesia/${kek.slug}" style="display: inline-block; background-color: #0f284e; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; text-decoration: none;">
              Lihat Detail Kawasan &rarr;
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [keks]);

  return (
    <div className="relative w-full h-[450px] sm:h-[520px] rounded-xl overflow-hidden border border-slate-200/80 shadow-md">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Legend Floating Widget */}
      <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-lg border border-slate-200 shadow-lg text-xs space-y-2 pointer-events-auto">
        <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
          Legenda Kawasan KEK
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block shrink-0 shadow-xs" />
          <span>KEK Beroperasi</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shrink-0 shadow-xs" />
          <span>Tahap Pembangunan</span>
        </div>
        <div className="pt-1 text-[10px] text-slate-400 border-t border-slate-100">
          Klik marker untuk informasi detail
        </div>
      </div>
    </div>
  );
}
