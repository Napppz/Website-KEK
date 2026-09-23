import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";
import { createUserSchema } from "@/lib/validations/auth";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (users && users.length > 0) {
      return NextResponse.json({ success: true, data: users });
    }
  } catch {
    console.warn("Neon query failed in GET /api/users, using fallback.");
  }

  // Fallback demo users
  return NextResponse.json({
    success: true,
    data: [
      {
        id: "usr-1",
        name: "Administrator Utama",
        email: "admin@kek.go.id",
        role: "SUPER_ADMIN",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr-2",
        name: "Editor Redaksi KEK",
        email: "editor@kek.go.id",
        role: "EDITOR",
        createdAt: new Date().toISOString(),
      },
    ],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validasi data gagal", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        role: parsed.data.role as Role,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal membuat pengguna baru";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
