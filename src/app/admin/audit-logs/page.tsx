"use client";

import * as React from "react";
import { History, User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminDataTable, type Column, type FilterOption } from "@/components/admin/admin-data-table";

interface AuditLogItem {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: string | null;
  createdAt: string;
}

export default function AdminAuditLogsPage() {
  const [data, setData] = React.useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const res = await fetch("/api/audit-logs");
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat audit log:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const filters: FilterOption[] = [
    {
      key: "action",
      label: "Jenis Aksi",
      options: [
        { label: "CREATE", value: "CREATE" },
        { label: "UPDATE", value: "UPDATE" },
        { label: "DELETE", value: "DELETE" },
        { label: "PUBLISH", value: "PUBLISH" },
        { label: "UNPUBLISH", value: "UNPUBLISH" },
        { label: "ROLE_CHANGE", value: "ROLE_CHANGE" },
      ],
    },
    {
      key: "entity",
      label: "Entitas Modul",
      options: [
        { label: "KEK", value: "KEK" },
        { label: "NEWS", value: "NEWS" },
        { label: "CATEGORY", value: "CATEGORY" },
        { label: "DOCUMENT", value: "DOCUMENT" },
        { label: "REPORT", value: "REPORT" },
        { label: "GALLERY", value: "GALLERY" },
        { label: "INVESTMENT", value: "INVESTMENT" },
        { label: "USER", value: "USER" },
      ],
    },
  ];

  const columns: Column<AuditLogItem>[] = [
    {
      key: "createdAt",
      header: "Waktu Aktivitas",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            {new Date(item.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      ),
    },
    {
      key: "userName",
      header: "Pengguna / Admin",
      sortable: true,
      render: (item) => (
        <div className="space-y-0.5">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{item.userName}</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">{item.userEmail}</div>
        </div>
      ),
    },
    {
      key: "action",
      header: "Aksi",
      sortable: true,
      render: (item) => {
        let badgeVariant: "emerald" | "amber" | "destructive" | "blue" | "secondary" = "secondary";
        if (item.action.includes("CREATE")) badgeVariant = "emerald";
        else if (item.action.includes("UPDATE")) badgeVariant = "blue";
        else if (item.action.includes("DELETE")) badgeVariant = "destructive";
        else if (item.action.includes("PUBLISH")) badgeVariant = "emerald";
        else if (item.action.includes("ROLE")) badgeVariant = "amber";

        return (
          <Badge variant={badgeVariant} className="text-[10px] font-bold">
            {item.action}
          </Badge>
        );
      },
    },
    {
      key: "entity",
      header: "Entitas Modul",
      sortable: true,
      render: (item) => (
        <Badge variant="outline" className="text-[10px] font-mono border-slate-300">
          {item.entity}
        </Badge>
      ),
    },
    {
      key: "metadata",
      header: "Catatan Aktivitas",
      render: (item) => (
        <span
          className="text-xs text-slate-600 line-clamp-1 max-w-[340px]"
          title={item.metadata || "-"}
        >
          {item.metadata || "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            Audit Log Aktivitas Sistem
          </h1>
          <p className="text-xs text-slate-500">
            Jejak digital seluruh mutasi data, pembuatan konten, penghapusan, dan perubahan role pengguna.
          </p>
        </div>
      </div>

      <AdminDataTable
        title="Daftar Log Aktivitas"
        columns={columns}
        data={data}
        isLoading={isLoading}
        filters={filters}
        searchPlaceholder="Cari nama admin, jenis aksi, entitas, atau catatan..."
        searchKey={(item) =>
          `${item.userName} ${item.userEmail} ${item.action} ${item.entity} ${item.metadata || ""}`
        }
      />
    </div>
  );
}
