"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Newspaper,
  Tags,
  FileText,
  BarChart3,
  Image as ImageIcon,
  TrendingUp,
  Users,
  History,
  ArrowLeft,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { isAdmin } from "@/lib/permissions";

interface AdminSidebarProps {
  userRole?: string | null;
  userName?: string;
  userEmail?: string;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({
  userRole,
  userName = "Administrator",
  userEmail = "admin@kek.go.id",
  isOpenMobile,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const userIsAdmin = isAdmin(userRole);

  const navSections = [
    {
      group: "Utama",
      items: [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      ],
    },
    {
      group: "Manajemen Konten",
      items: [
        { name: "Kawasan KEK", href: "/admin/kek", icon: Building2 },
        { name: "Berita & Artikel", href: "/admin/berita", icon: Newspaper },
        { name: "Kategori Berita", href: "/admin/kategori-berita", icon: Tags },
        { name: "Dokumen JDIH", href: "/admin/dokumen", icon: FileText },
        { name: "Laporan Kinerja", href: "/admin/laporan", icon: BarChart3 },
        { name: "Galeri Kawasan", href: "/admin/galeri", icon: ImageIcon },
        { name: "Data Investasi", href: "/admin/investasi", icon: TrendingUp },
      ],
    },
    {
      group: "Sistem & Keamanan",
      items: [
        ...(userIsAdmin
          ? [{ name: "Kelola Pengguna", href: "/admin/users", icon: Users }]
          : []),
        { name: "Audit Log Aktivitas", href: "/admin/audit-logs", icon: History },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#07172e] text-white border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black text-base shadow-md group-hover:scale-105 transition-transform">
            K
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>KEK Admin CMS</span>
              <span className="text-[9px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.2 rounded font-mono">
                v2.0
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Portal Pengelola Konten</div>
          </div>
        </Link>
        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.group} className="space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {section.group}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-white" : "text-slate-400"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.href === "/admin/users" && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded-full font-bold">
                      Admin
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom User Status Card */}
      <div className="p-4 border-t border-slate-800/80 space-y-3 bg-[#051124]">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Lihat Website Publik</span>
        </Link>

        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
            {userName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate">{userName}</div>
            <div className="text-[10px] text-slate-400 truncate">{userEmail}</div>
          </div>
          <Badge
            variant={userIsAdmin ? "amber" : "blue"}
            className="text-[9px] font-bold py-0.5 px-1.5 shrink-0"
          >
            {userRole || "EDITOR"}
          </Badge>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:flex w-64 flex-col shrink-0 min-h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-full h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
