import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Newspaper, FileText, Users } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ringkasan Dashboard</h1>
        <p className="text-xs text-slate-500">
          Statistik konten dan manajemen portal KEK Indonesia.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Total Kawasan KEK
            </CardTitle>
            <Building2 className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">7</div>
            <p className="text-[10px] text-slate-400 mt-1">5 Beroperasi, 2 Tahap Pembangunan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Berita & Siaran Pers
            </CardTitle>
            <Newspaper className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">3</div>
            <p className="text-[10px] text-slate-400 mt-1">Semua terbit publik</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Dokumen JDIH
            </CardTitle>
            <FileText className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">3</div>
            <p className="text-[10px] text-slate-400 mt-1">PP, PMK & Keppres</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Pengguna Sistem
            </CardTitle>
            <Users className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">2</div>
            <p className="text-[10px] text-slate-400 mt-1">1 Admin, 1 Editor</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
