import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { AdminLayoutClient } from "@/components/admin/admin-layout-client";

export const metadata: Metadata = {
  title: "Admin Panel | KEK Indonesia",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userName = session?.user?.name || "Administrator";
  const userEmail = session?.user?.email || "admin@kek.go.id";
  const userRole = session?.user?.role || "ADMIN";

  return (
    <AdminLayoutClient
      userName={userName}
      userEmail={userEmail}
      userRole={userRole}
    >
      {children}
    </AdminLayoutClient>
  );
}
