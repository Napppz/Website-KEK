import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Pengguna Sistem</h1>
          <p className="text-xs text-slate-500">Manajemen peran dan hak akses akun administrator & editor.</p>
        </div>
        <Button size="sm" className="gap-2">
          <UserPlus className="w-4 h-4" />
          Tambah Pengguna Baru
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-xs text-slate-500">
        Tabel manajemen pengguna dengan kontrol role ADMIN dan EDITOR.
      </div>
    </div>
  );
}
