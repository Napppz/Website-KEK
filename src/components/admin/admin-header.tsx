"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronRight, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/components/admin/logout-button";

interface AdminHeaderProps {
  userName?: string;
  userEmail?: string;
  userRole?: string;
  onOpenMobileSidebar: () => void;
}

export function AdminHeader({
  userName = "Administrator",
  userEmail = "admin@kek.go.id",
  userRole = "ADMIN",
  onOpenMobileSidebar,
}: AdminHeaderProps) {
  const pathname = usePathname();

  // Generate Breadcrumbs from pathname
  const pathSegments = pathname
    .split("/")
    .filter(Boolean)
    .map((seg, idx, arr) => {
      const href = "/" + arr.slice(0, idx + 1).join("/");
      let label = seg;

      if (seg === "admin") label = "Dashboard";
      else if (seg === "kek") label = "Kawasan KEK";
      else if (seg === "berita") label = "Berita & Artikel";
      else if (seg === "kategori-berita") label = "Kategori";
      else if (seg === "dokumen") label = "Dokumen JDIH";
      else if (seg === "laporan") label = "Laporan";
      else if (seg === "galeri") label = "Galeri";
      else if (seg === "investasi") label = "Investasi";
      else if (seg === "users") label = "Pengguna";
      else if (seg === "audit-logs") label = "Audit Log";
      else if (seg === "new") label = "Tambah Baru";
      else if (seg === "edit") label = "Edit";

      return { href, label, isLast: idx === arr.length - 1 };
    });

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link
            href="/admin"
            className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors font-medium"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Admin</span>
          </Link>

          {pathSegments.slice(1).map((seg) => (
            <React.Fragment key={seg.href}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              {seg.isLast ? (
                <span className="font-bold text-slate-900 capitalize truncate max-w-[140px] sm:max-w-xs">
                  {seg.label}
                </span>
              ) : (
                <Link
                  href={seg.href}
                  className="hover:text-blue-600 transition-colors capitalize font-medium"
                >
                  {seg.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: User Role Badge & Logout */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden sm:flex items-center gap-2">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-800 leading-tight">{userName}</div>
            <div className="text-[10px] text-slate-400 leading-tight">{userEmail}</div>
          </div>
          <Badge
            variant={userRole === "ADMIN" || userRole === "SUPER_ADMIN" ? "amber" : "blue"}
            className="text-[10px] font-bold py-0.5 px-2"
          >
            {userRole}
          </Badge>
        </div>

        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

        <LogoutButton />
      </div>
    </header>
  );
}
