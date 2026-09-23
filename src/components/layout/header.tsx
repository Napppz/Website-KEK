"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Menu,
  X,
  ChevronDown,
  Globe2,
  ShieldCheck,
  TrendingUp,
  LogIn,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Beranda", href: "/" },
  { name: "Tentang KEK", href: "/tentang-kek" },
  {
    name: "Kawasan KEK",
    href: "/kek-indonesia",
    children: [
      { name: "Daftar Semua Kawasan", href: "/kek-indonesia" },
      { name: "Peta Persebaran", href: "/kek-indonesia#peta" },
      { name: "KEK Industri & Manufaktur", href: "/kek-indonesia?tipe=industri" },
      { name: "KEK Pariwisata & Jasa", href: "/kek-indonesia?tipe=pariwisata" },
    ],
  },
  { name: "Investasi", href: "/investasi" },
  { name: "Berita", href: "/berita" },
  { name: "JDIH", href: "/jdih" },
  { name: "Laporan", href: "/laporan" },
  { name: "Galeri", href: "/galeri" },
  { name: "Kontak", href: "/kontak" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState<string | null>(null);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-xs">
      {/* 1. TOP BAR: Kelembagaan & Pengumuman Resmi */}
      <div className="bg-[#0b1f3c] text-white text-xs py-2 px-4 sm:px-8 border-b border-slate-700/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="inline-flex items-center gap-1.5 font-medium text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Portal Resmi
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline">
              Pusat Informasi & Pelayanan Investasi Kawasan Ekonomi Khusus Indonesia
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <div className="hidden lg:flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-slate-400" />
              <span>ID</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                EN
              </span>
            </div>
            <span className="hidden lg:inline text-slate-700">|</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-slate-300 hover:text-amber-300 transition-colors"
            >
              <LogIn className="w-3 h-3" />
              <span>Portal Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR: Logo & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-10 h-10 rounded-lg bg-[#0f284e] flex items-center justify-center text-white shadow-md group-hover:bg-[#1a3b6b] transition-colors">
            <Building2 className="w-6 h-6 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-[#0f284e]">
                KEK INDONESIA
              </span>
              <Badge variant="emerald" className="hidden sm:inline-flex text-[10px] py-0 px-1.5">
                Official Portal
              </Badge>
            </div>
            <span className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">
              Special Economic Zones Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navigationItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            if (item.children) {
              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(item.name)}
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  <button
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1",
                      isActive
                        ? "text-[#0f284e] bg-slate-100 font-semibold"
                        : "text-slate-700 hover:text-[#0f284e] hover:bg-slate-50"
                    )}
                  >
                    {item.name}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {dropdownOpen === item.name && (
                    <div className="absolute top-full left-0 w-56 pt-2 z-50">
                      <div className="bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 overflow-hidden">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0f284e]"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "text-[#0f284e] bg-slate-100 font-semibold"
                    : "text-slate-700 hover:text-[#0f284e] hover:bg-slate-50"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Link
            href="/search"
            className="p-2 text-slate-600 hover:text-[#0f284e] hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
            aria-label="Pencarian Global"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span className="hidden md:inline">Cari</span>
          </Link>

          <Link href="/investasi" className="hidden sm:inline-flex">
            <Button size="sm" variant="default" className="font-semibold gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Peluang Investasi
            </Button>
          </Link>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            aria-label="Buka menu navigasi"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* 3. MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1 shadow-lg max-h-[80vh] overflow-y-auto">
          {navigationItems.map((item) => (
            <div key={item.name} className="py-1">
              <Link
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-50 hover:text-[#0f284e]"
              >
                {item.name}
              </Link>
              {item.children && (
                <div className="pl-4 border-l-2 border-slate-200 ml-3 space-y-1 mt-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-2 py-1.5 text-xs text-slate-600 hover:text-[#0f284e]"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
            <Link
              href="/investasi"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button className="w-full gap-2 font-semibold">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Peluang Investasi KEK
              </Button>
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-xs text-slate-500 py-1"
            >
              Masuk Portal Administrator
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
