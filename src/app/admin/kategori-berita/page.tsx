"use client";

import * as React from "react";
import { Edit2, Trash2, Plus, Tags, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminDataTable, type Column } from "@/components/admin/admin-data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { FormFieldWrapper, SlugInput } from "@/components/admin/forms/form-components";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  _count?: { news: number };
  createdAt: string;
}

export default function AdminKategoriBeritaPage() {
  const { addToast } = useToast();
  const [data, setData] = React.useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<CategoryItem | null>(null);
  const [nameInput, setNameInput] = React.useState("");
  const [slugInput, setSlugInput] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [formError, setFormError] = React.useState("");

  // Delete state
  const [deleteTarget, setDeleteTarget] = React.useState<CategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const loadCategories = React.useCallback(async () => {
    try {
      const res = await fetch("/api/kategori-berita");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Gagal memuat kategori:", err);
      addToast({
        title: "Gagal Memuat Data",
        description: "Tidak dapat mengambil daftar kategori berita.",
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
        const res = await fetch("/api/kategori-berita");
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat kategori:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const openCreateDialog = () => {
    setEditingItem(null);
    setNameInput("");
    setSlugInput("");
    setFormError("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (cat: CategoryItem) => {
    setEditingItem(cat);
    setNameInput(cat.name);
    setSlugInput(cat.slug);
    setFormError("");
    setIsDialogOpen(true);
  };

  const handleGenerateSlug = () => {
    if (!nameInput) return;
    const generated = nameInput
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlugInput(generated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !slugInput.trim()) {
      setFormError("Nama dan slug kategori wajib diisi.");
      return;
    }

    setIsSaving(true);
    setFormError("");
    try {
      const url = editingItem ? `/api/kategori-berita/${editingItem.id}` : "/api/kategori-berita";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput, slug: slugInput }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan kategori");
      }

      addToast({
        title: editingItem ? "Kategori Diperbarui" : "Kategori Ditambahkan",
        description: `Kategori "${nameInput}" berhasil disimpan.`,
        type: "success",
      });

      setIsDialogOpen(false);
      loadCategories();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Terjadi kesalahan sistem.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    // Client pre-check for dependency
    if (deleteTarget._count && deleteTarget._count.news > 0) {
      addToast({
        title: "Kategori Sedang Digunakan",
        description: `Kategori "${deleteTarget.name}" masih digunakan oleh ${deleteTarget._count.news} berita. Hapus atau pindahkan berita terlebih dahulu.`,
        type: "error",
      });
      setDeleteTarget(null);
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/kategori-berita/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menghapus kategori");
      }

      addToast({
        title: "Kategori Dihapus",
        description: `Kategori "${deleteTarget.name}" berhasil dihapus.`,
        type: "success",
      });

      setData((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      addToast({
        title: "Penghapusan Ditolak",
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus kategori.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<CategoryItem>[] = [
    {
      key: "name",
      header: "Nama Kategori",
      sortable: true,
      render: (item) => (
        <div className="space-y-0.5">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Tags className="w-3.5 h-3.5 text-blue-600" />
            <span>{item.name}</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">slug: {item.slug}</div>
        </div>
      ),
    },
    {
      key: "newsCount",
      header: "Artikel Terkait",
      sortable: true,
      render: (item) => (
        <Badge
          variant={item._count?.news ? "blue" : "secondary"}
          className="text-xs font-semibold"
        >
          {item._count?.news || 0} Artikel
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Dibuat",
      sortable: true,
      render: (item) => (
        <span className="text-xs text-slate-500">
          {new Date(item.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Tags className="w-5 h-5 text-emerald-600" />
            Kelola Kategori Berita
          </h1>
          <p className="text-xs text-slate-500">
            Klasifikasi taksonomi untuk pengelompokan siaran pers dan artikel kawasan.
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="bg-blue-700 hover:bg-blue-800 text-white text-xs h-9 gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Tambah Kategori
        </Button>
      </div>

      <AdminDataTable
        title="Daftar Kategori Berita"
        columns={columns}
        data={data}
        isLoading={isLoading}
        searchPlaceholder="Cari nama atau slug kategori..."
        searchKey={(item) => `${item.name} ${item.slug}`}
        actions={(item) => (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEditDialog(item)}
              className="p-1.5 h-auto rounded-lg border border-slate-200 hover:bg-blue-50 hover:text-blue-600 text-slate-600"
              title="Edit kategori"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteTarget(item)}
              className="p-1.5 h-auto rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
              title="Hapus kategori"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      />

      {/* Modal Dialog for Add / Edit */}
      <DialogPrimitive.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 bg-slate-950/60 z-50 backdrop-blur-xs animate-in fade-in" />
          <DialogPrimitive.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white p-6 rounded-2xl shadow-xl z-50 border border-slate-200 animate-in zoom-in-95">
            <DialogPrimitive.Title className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Tags className="w-4 h-4 text-blue-600" />
              {editingItem ? "Edit Kategori Berita" : "Tambah Kategori Baru"}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-xs text-slate-500 mt-1">
              Atur nama dan URL slug kategori untuk klasifikasi artikel berita.
            </DialogPrimitive.Description>

            <form onSubmit={handleSave} className="space-y-4 mt-5">
              <FormFieldWrapper label="Nama Kategori" required>
                <Input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Contoh: Investasi & Bisnis"
                  className="text-xs h-10"
                  required
                />
              </FormFieldWrapper>

              <SlugInput
                value={slugInput}
                onChange={setSlugInput}
                onGenerateFromTitle={handleGenerateSlug}
              />

              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
                  {formError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDialogOpen(false)}
                  className="text-xs h-9"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSaving}
                  className="bg-blue-700 hover:bg-blue-800 text-white text-xs h-9 gap-1.5"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingItem ? "Perbarui Kategori" : "Simpan Kategori"}
                </Button>
              </div>
            </form>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Kategori Berita"
        description={`Apakah Anda yakin ingin menghapus kategori "${deleteTarget?.name}"? Jika kategori ini masih digunakan oleh berita, sistem akan menolak penghapusan.`}
        confirmLabel="Hapus Kategori"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
