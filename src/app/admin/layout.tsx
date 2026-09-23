import * as React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Newspaper,
  FileText,
  BarChart3,
  Image as ImageIcon,
  Users,
  ArrowLeft,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/admin/logout-button";

const adminNav = [
  { name: "Ringkasan", href: "/admin", icon: LayoutDashboard },
  { name: "Kawasan KEK", href: "/admin/kek", icon: Building2 },
  { name: "Berita & Artikel", href: "/admin/berita", icon: Newspaper },
  { name: "Dokumen JDIH", href: "/admin/dokumen", icon: FileText },
  { name: "Laporan Tahunan", href: "/admin/laporan", icon: BarChart3 },
  { name: "Galeri Foto", href: "/admin/galeri", icon: ImageIcon },
  { name: "Kelola Pengguna", href: "/admin/users", icon: Users },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userName = session?.user?.name || "Administrator";
  const userEmail = session?.user?.email || "admin@kek.go.id";
  const userRole = session?.user?.role || "SUPER_ADMIN";

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#0b1f3c] text-white flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm">
            K
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white">
              KEK Admin Panel
            </div>
            <div className="text-[10px] text-slate-400">Pusat Kelola Data</div>
          </div>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Website</span>
          </Link>
          <div className="px-3 py-2 text-[11px] text-slate-400 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate">{userName}</span>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="emerald">Admin Mode</Badge>
            <Badge variant="amber" className="text-[10px] font-bold">
              {userRole}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">{userEmail}</span>
            <div className="h-4 w-px bg-slate-200" />
            <LogoutButton />
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
