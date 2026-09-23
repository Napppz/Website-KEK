import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: "navy" | "white" | "accent";
  className?: string;
}

export function StatCard({
  label,
  value,
  subtitle,
  icon,
  variant = "white",
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border",
        variant === "navy" && "bg-[#0b1f3c] text-white border-slate-700/60",
        variant === "white" && "bg-white text-slate-900 border-slate-200/80 shadow-xs",
        variant === "accent" && "bg-emerald-50 text-emerald-950 border-emerald-200/80",
        className
      )}
    >
      <CardContent className="p-6 flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              variant === "navy" ? "text-amber-400" : "text-slate-500"
            )}
          >
            {label}
          </p>
          <div
            className={cn(
              "text-2xl sm:text-3xl font-extrabold tracking-tight",
              variant === "navy" ? "text-white" : "text-slate-950"
            )}
          >
            {value}
          </div>
          {subtitle && (
            <p
              className={cn(
                "text-xs leading-normal",
                variant === "navy" ? "text-slate-300" : "text-slate-500"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>

        {icon && (
          <div
            className={cn(
              "p-3 rounded-xl shrink-0 flex items-center justify-center",
              variant === "navy"
                ? "bg-white/10 text-amber-400 border border-white/10"
                : "bg-slate-100 text-blue-700"
            )}
          >
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
