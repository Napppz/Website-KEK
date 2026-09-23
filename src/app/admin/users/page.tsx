"use client";

import * as React from "react";
import { Edit2, Trash2, Users, ShieldCheck, UserCheck, Plus, ArrowLeftRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminDataTable, type Column, type FilterOption } from "@/components/admin/admin-data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { UserDialog, type UserData } from "@/components/admin/user-dialog";

export default function AdminUsersPage() {
  const { addToast } = useToast();
  const [data, setData] = React.useState<UserData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Dialog state for create/edit
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<UserData | null>(null);

  // Role toggle dialog state
  const [roleChangeTarget, setRoleChangeTarget] = React.useState<UserData | null>(null);
  const [isChangingRole, setIsChangingRole] = React.useState(false);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = React.useState<UserData | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const loadUsers = React.useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Gagal memuat pengguna:", err);
      addToast({
        title: "Gagal Memuat Data",
        description: "Tidak dapat mengambil daftar pengguna dari sistem.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  React.useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const res = await fetch("/api/users");
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat pengguna:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRoleToggle = async () => {
    if (!roleChangeTarget) return;
    const nextRole = roleChangeTarget.role === "ADMIN" || roleChangeTarget.role === "SUPER_ADMIN"
      ? "EDITOR"
      : "ADMIN";

    setIsChangingRole(true);
    try {
      const res = await fetch(`/api/users/${roleChangeTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nextRole }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal mengubah role pengguna");
      }

      addToast({
        title: "Role Berhasil Diubah",
        description: `Hak akses ${roleChangeTarget.name} kini diubah menjadi ${nextRole}.`,
        type: "success",
      });

      setData((prev) =>
        prev.map((u) => (u.id === roleChangeTarget.id ? { ...u, role: nextRole } : u))
      );
      setRoleChangeTarget(null);
    } catch (err) {
      addToast({
        title: "Perubahan Role Gagal",
        description: err instanceof Error ? err.message : "Terjadi kesalahan sistem saat update role.",
        type: "error",
      });
    } finally {
      setIsChangingRole(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/users/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menghapus pengguna");
      }

      addToast({
        title: "Pengguna Dihapus",
        description: `Akun staf "${deleteTarget.name}" berhasil dihapus.`,
        type: "success",
      });

      setData((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      addToast({
        title: "Penghapusan Gagal",
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus pengguna.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const filters: FilterOption[] = [
    {
      key: "role",
      label: "Hak Akses (Role)",
      options: [
        { label: "Administrator", value: "ADMIN" },
        { label: "Editor Konten", value: "EDITOR" },
      ],
    },
  ];

  const columns: Column<UserData>[] = [
    {
      key: "name",
      header: "Nama Pengguna",
      sortable: true,
      render: (item) => (
        <div className="space-y-0.5">
          <div className="font-bold text-slate-900">{item.name}</div>
          <div className="text-[11px] text-slate-500">{item.email}</div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Kewenangan Role",
      sortable: true,
      render: (item) => {
        const isAdminRole = item.role === "ADMIN" || item.role === "SUPER_ADMIN";
        return (
          <Badge
            variant={isAdminRole ? "blue" : "secondary"}
            className="text-[10px] font-bold py-0.5 px-2.5 flex items-center gap-1 w-fit"
          >
            {isAdminRole ? (
              <ShieldCheck className="w-3 h-3 text-blue-500" />
            ) : (
              <UserCheck className="w-3 h-3 text-slate-500" />
            )}
            <span>{isAdminRole ? "Administrator" : "Editor Redaksi"}</span>
          </Badge>
        );
      },
    },
    {
      key: "status",
      header: "Status Akun",
      render: () => (
        <Badge variant="emerald" className="text-[10px] font-semibold">
          Aktif
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Terdaftar Sejak",
      sortable: true,
      render: (item) => (
        <span className="text-xs text-slate-500">
          {item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Kelola Pengguna & Hak Akses Role
          </h1>
          <p className="text-xs text-slate-500">
            Atur akun pengelola portal, hak akses Administrator dan Editor Redaksi.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingUser(null);
            setIsDialogOpen(true);
          }}
          className="bg-blue-700 hover:bg-blue-800 text-white text-xs h-9 gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Tambah Pengguna Baru
        </Button>
      </div>

      <AdminDataTable
        title="Daftar Pengguna Sistem KEK"
        columns={columns}
        data={data}
        isLoading={isLoading}
        filters={filters}
        searchPlaceholder="Cari nama atau email pengguna..."
        searchKey={(item) => `${item.name} ${item.email} ${item.role}`}
        actions={(item) => (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRoleChangeTarget(item)}
              className="text-[11px] h-8 px-2.5 text-slate-700 hover:bg-slate-100 border-slate-200 flex items-center gap-1"
              title="Ubah Role (Admin / Editor)"
            >
              <ArrowLeftRight className="w-3 h-3 text-blue-600" />
              <span>Ganti Role</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingUser(item);
                setIsDialogOpen(true);
              }}
              className="p-1.5 h-auto rounded-lg border border-slate-200 hover:bg-blue-50 hover:text-blue-600 text-slate-600"
              title="Edit data pengguna"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteTarget(item)}
              className="p-1.5 h-auto rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
              title="Hapus akun"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      />

      {/* User Create/Edit Dialog */}
      <UserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingUser}
        onSuccess={() => {
          setIsDialogOpen(false);
          loadUsers();
        }}
      />

      {/* Role Change Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!roleChangeTarget}
        title="Konfirmasi Perubahan Hak Akses Role"
        description={`Apakah Anda yakin ingin mengubah hak akses pengguna "${roleChangeTarget?.name}" dari ${roleChangeTarget?.role} menjadi ${
          roleChangeTarget?.role === "ADMIN" || roleChangeTarget?.role === "SUPER_ADMIN"
            ? "EDITOR"
            : "ADMIN"
        }?`}
        confirmLabel="Ya, Ubah Role"
        variant="primary"
        isLoading={isChangingRole}
        onConfirm={handleRoleToggle}
        onClose={() => setRoleChangeTarget(null)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Konfirmasi Hapus Akun Pengguna"
        description={`Apakah Anda yakin ingin menghapus akun "${deleteTarget?.name}" (${deleteTarget?.email})? Pengguna tidak akan dapat mengakses CMS lagi.`}
        confirmLabel="Hapus Akun"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
