"use client";

import * as React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Filter, RotateCcw, MapPin } from "lucide-react";
import type { KekWithDetails } from "@/lib/data/kek";

export interface KekLeafletInnerProps {
  keks: KekWithDetails[];
}

export default function KekLeafletInner({ keks }: KekLeafletInnerProps) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<L.Map | null>(null);
  const markerLayerRef = React.useRef<L.LayerGroup | null>(null);

  // Client-side filter states for map
  const [selectedProvince, setSelectedProvince] = React.useState<string>("ALL");
  const [selectedFocus, setSelectedFocus] = React.useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("ALL");

  // Extract unique provinces
  const provinces = React.useMemo(() => {
    return Array.from(new Set(keks.map((k) => k.province))).sort();
  }, [keks]);

  // Extract unique focus sectors
  const foci = React.useMemo(() => {
    const set = new Set<string>();
    keks.forEach((k) => {
      k.focus.split(/[,&]/).forEach((part) => {
        const trimmed = part.trim();
        if (trimmed.length > 2) set.add(trimmed);
      });
    });
    return Array.from(set).sort();
  }, [keks]);

  // Filtered KEKs
  const filteredKeks = React.useMemo(() => {
    return keks.filter((k) => {
      if (selectedProvince !== "ALL" && k.province.toLowerCase() !== selectedProvince.toLowerCase()) {
        return false;
      }
      if (selectedStatus !== "ALL" && k.status !== selectedStatus) {
        return false;
      }
      if (selectedFocus !== "ALL" && !k.focus.toLowerCase().includes(selectedFocus.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [keks, selectedProvince, selectedStatus, selectedFocus]);

  // Marker icon builder
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

  // Initialize Map once
  React.useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-0.7893, 117.9213], // Pusat kepulauan Indonesia
      zoom: 5,
      minZoom: 4,
      maxZoom: 14,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    // Base OSM Positron TileLayer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    // Marker Layer Group
    const markerLayer = L.layerGroup().addTo(map);
    markerLayerRef.current = markerLayer;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerLayerRef.current = null;
    };
  }, []);

  // Update markers when filteredKeks changes without reloading map
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    const markerLayer = markerLayerRef.current;
    if (!map || !markerLayer) return;

    markerLayer.clearLayers();

    const bounds: L.LatLngTuple[] = [];

    filteredKeks.forEach((kek) => {
      if (!kek.latitude || !kek.longitude) return;

      const isOperating = kek.status === "BEROPERASI";
      const marker = L.marker([kek.latitude, kek.longitude], {
        icon: createCustomIcon(isOperating),
      }).addTo(markerLayer);

      bounds.push([kek.latitude, kek.longitude]);

      const statusBadge = isOperating
        ? '<span style="background-color:#ecfdf5;color:#047857;padding:3px 8px;border-radius:9999px;font-size:10px;font-weight:700;border:1px solid #a7f3d0;display:inline-block;">Beroperasi</span>'
        : '<span style="background-color:#fffbeb;color:#b45309;padding:3px 8px;border-radius:9999px;font-size:10px;font-weight:700;border:1px solid #fde68a;display:inline-block;">Tahap Pembangunan</span>';

      const popupContent = `
        <div style="font-family: inherit; padding: 4px 2px; min-width: 200px; max-width: 250px;">
          <div style="margin-bottom: 6px;">${statusBadge}</div>
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 800; color: #0b1f3c; line-height: 1.25;">${kek.name}</h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #475569; font-weight: 500;">${kek.city}, ${kek.province}</p>
          <div style="margin: 6px 0; font-size: 11px; color: #334155; line-height: 1.35; background: #f8fafc; padding: 6px 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <strong style="color: #0b1f3c;">Fokus:</strong> ${kek.focus}
          </div>
          <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #e2e8f0;">
            <a href="/kek-indonesia/${kek.slug}" style="display: block; text-align: center; background-color: #0b1f3c; color: #ffffff; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; text-decoration: none; transition: background-color 0.2s;">
              Lihat Detail &rarr;
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    // If filter isolates a subset, pan nicely to them
    if (bounds.length > 0 && bounds.length < keks.length) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40], maxZoom: 8 });
    }
  }, [filteredKeks, keks.length]);

  const hasFilterActive = selectedProvince !== "ALL" || selectedFocus !== "ALL" || selectedStatus !== "ALL";

  const handleResetFilters = () => {
    setSelectedProvince("ALL");
    setSelectedFocus("ALL");
    setSelectedStatus("ALL");
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([-0.7893, 117.9213], 5);
    }
  };

  return (
    <div className="space-y-3">
      {/* Interactive Map Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0b1f3c]">
          <Filter className="w-3.5 h-3.5 text-amber-500" />
          <span>Filter Peta:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Provinsi */}
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="h-8 px-2.5 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            aria-label="Filter Peta Provinsi"
          >
            <option value="ALL">Semua Provinsi</option>
            {provinces.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>

          {/* Fokus Sektor */}
          <select
            value={selectedFocus}
            onChange={(e) => setSelectedFocus(e.target.value)}
            className="h-8 px-2.5 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            aria-label="Filter Peta Sektor Fokus"
          >
            <option value="ALL">Semua Fokus Industri</option>
            {foci.map((focus) => (
              <option key={focus} value={focus}>
                {focus}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-8 px-2.5 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            aria-label="Filter Peta Status Kawasan"
          >
            <option value="ALL">Semua Status</option>
            <option value="BEROPERASI">Beroperasi</option>
            <option value="TAHAP_PEMBANGUNAN">Tahap Pembangunan</option>
          </select>

          {hasFilterActive && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="h-8 px-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              Reset
            </button>
          )}
        </div>

        <div className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
          Menampilkan <strong className="text-amber-600">{filteredKeks.length}</strong> titik kawasan
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[450px] sm:h-[520px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-md">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Map Legend Floating Widget */}
        <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 shadow-lg text-xs space-y-2 pointer-events-auto">
          <div className="font-bold text-[#0b1f3c] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            Legenda Marker KEK
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block shrink-0 shadow-xs" />
            <span>KEK Beroperasi</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shrink-0 shadow-xs" />
            <span>Tahap Pembangunan</span>
          </div>
          <div className="pt-1 text-[10px] text-slate-400 border-t border-slate-100">
            Klik marker untuk membuka popup detail
          </div>
        </div>
      </div>
    </div>
  );
}
