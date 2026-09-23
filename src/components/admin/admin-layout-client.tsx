"use client";

import * as React from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { ToastProvider } from "@/components/ui/toast";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
  userRole?: string;
}

export function AdminLayoutClient({
  children,
  userName = "Administrator",
  userEmail = "admin@kek.go.id",
  userRole = "ADMIN",
}: AdminLayoutClientProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen flex bg-slate-100/90 text-slate-900 font-sans antialiased">
        {/* Sidebar Component */}
        <AdminSidebar
          userName={userName}
          userEmail={userEmail}
          userRole={userRole}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <AdminHeader
            userName={userName}
            userEmail={userEmail}
            userRole={userRole}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
