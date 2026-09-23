// ==============================================================================
// KEK INDONESIA PORTAL - ROLE-BASED ACCESS CONTROL (RBAC) PERMISSIONS
// ==============================================================================

export type UserRole = "ADMIN" | "EDITOR";

/**
 * Memeriksa apakah pengguna memiliki hak akses Administrator penuh
 */
export function isAdmin(role?: string | null): boolean {
  if (!role) return false;
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

/**
 * Memeriksa apakah pengguna adalah Editor atau Admin
 */
export function isEditor(role?: string | null): boolean {
  if (!role) return false;
  return role === "EDITOR" || role === "ADMIN" || role === "SUPER_ADMIN";
}

/**
 * Memeriksa izin untuk mengelola pengguna (hanya ADMIN)
 */
export function canManageUsers(role?: string | null): boolean {
  return isAdmin(role);
}

/**
 * Memeriksa izin untuk menghapus entitas data
 */
export function canDeleteContent(role?: string | null): boolean {
  return isAdmin(role) || role === "EDITOR";
}

/**
 * Memeriksa izin untuk mempublikasikan konten
 */
export function canPublishContent(role?: string | null): boolean {
  return isAdmin(role) || role === "EDITOR";
}
