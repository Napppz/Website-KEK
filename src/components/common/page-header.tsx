import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";

export interface PageHeaderProps {
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "emerald" | "amber" | "blue";
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}

export function PageHeader({
  badge,
  badgeVariant = "blue",
  title,
  description,
  breadcrumbs = [],
  children,
}: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-b from-[#0b1f3c] to-[#0f284e] text-white py-12 sm:py-16 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-5">
        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList className="text-slate-300">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="hover:text-amber-400 transition-colors">
                  Beranda
                </BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.label}>
                  <BreadcrumbSeparator className="text-slate-400" />
                  <BreadcrumbItem>
                    {crumb.href && idx < breadcrumbs.length - 1 ? (
                      <BreadcrumbLink href={crumb.href} className="hover:text-amber-400 transition-colors">
                        {crumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="text-white font-medium">
                        {crumb.label}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        <div className="space-y-3 max-w-3xl">
          {badge && (
            <Badge variant={badgeVariant} className="px-3 py-1 text-xs uppercase tracking-wider font-semibold">
              {badge}
            </Badge>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {description}
            </p>
          )}
        </div>

        {children && <div className="pt-2">{children}</div>}
      </div>
    </div>
  );
}
