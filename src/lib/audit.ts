// ==============================================================================
// KEK INDONESIA PORTAL - AUDIT LOG LOGGING SERVICE
// ==============================================================================

import { prisma } from "@/lib/prisma";

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "PUBLISH"
  | "UNPUBLISH"
  | "ROLE_CHANGE";

export type AuditEntity =
  | "KEK"
  | "NEWS"
  | "CATEGORY"
  | "DOCUMENT"
  | "REPORT"
  | "GALLERY"
  | "INVESTMENT"
  | "USER";

export interface LogParams {
  userId: string;
  userEmail: string;
  userName: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string;
  metadata?: string;
}

/**
 * Mencatat aktivitas modifikasi data di CMS Admin
 */
export async function createAuditLog(params: LogParams) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId: params.userId,
        userEmail: params.userEmail,
        userName: params.userName,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        metadata: params.metadata,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
    return null;
  }
}

/**
 * Mengambil daftar aktivitas terbaru untuk ditampilkan di dashboard
 */
export async function getRecentAuditLogs(limit: number = 10) {
  try {
    return await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch {
    return [];
  }
}
