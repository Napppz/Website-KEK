import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";
import { invalidateCache } from "@/lib/cache";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch {
    return NextResponse.json(
      { success: false, error: "Gagal mengambil detail pengguna" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || !isAdmin(session.user.role)) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Hanya administrator yang berwenang." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    // Prevent self-demotion if current user is demoting themselves
    if (session.user.id === id && body.role && body.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Anda tidak dapat menurunkan hak akses akun Anda sendiri." },
        { status: 400 }
      );
    }

    const updateData: Prisma.UserUpdateInput = {};
    if (body.name) updateData.name = body.name;
    if (body.email) updateData.email = body.email;
    if (body.role) updateData.role = body.role;
    if (body.password) {
      updateData.passwordHash = await bcrypt.hash(body.password, 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const isRoleChange = body.role && body.role !== existingUser.role;
    await createAuditLog({
      userId: session.user.id || "admin",
      userEmail: session.user.email || "admin@kek.go.id",
      userName: session.user.name || "Administrator",
      action: isRoleChange ? "ROLE_CHANGE" : "UPDATE",
      entity: "USER",
      entityId: updated.id,
      metadata: isRoleChange
        ? `Perubahan role ${existingUser.email} dari ${existingUser.role} ke ${updated.role}`
        : `Update profil pengguna ${updated.email}`,
    });

    invalidateCache("admin:dashboard:metrics");

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui pengguna";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || !isAdmin(session.user.role)) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Hanya administrator yang berwenang." },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Prevent deleting own account
    if (session.user.id === id) {
      return NextResponse.json(
        { success: false, error: "Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    await createAuditLog({
      userId: session.user.id || "admin",
      userEmail: session.user.email || "admin@kek.go.id",
      userName: session.user.name || "Administrator",
      action: "DELETE",
      entity: "USER",
      entityId: id,
      metadata: `Penghapusan akun staf pengguna ${existingUser.email}`,
    });

    invalidateCache("admin:dashboard:metrics");

    return NextResponse.json({ success: true, message: "Pengguna berhasil dihapus" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menghapus pengguna";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
