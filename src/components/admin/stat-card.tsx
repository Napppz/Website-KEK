import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  color?: "blue" | "emerald" | "amber" | "indigo" | "pink" | "purple" | "cyan" | "slate";
}

const colorStyles = {
  blue: {
    iconBg: "bg-blue-50 text-blue-600 border-blue-100",
    borderHover: "hover:border-blue-300",
  },
  emerald: {
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    borderHover: "hover:border-emerald-300",
  },
  amber: {
    iconBg: "bg-amber-50 text-amber-600 border-amber-100",
    borderHover: "hover:border-amber-300",
  },
  indigo: {
    iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
    borderHover: "hover:border-indigo-300",
  },
  pink: {
    iconBg: "bg-pink-50 text-pink-600 border-pink-100",
    borderHover: "hover:border-pink-300",
  },
  purple: {
    iconBg: "bg-purple-50 text-purple-600 border-purple-100",
    borderHover: "hover:border-purple-300",
  },
  cyan: {
    iconBg: "bg-cyan-50 text-cyan-600 border-cyan-100",
    borderHover: "hover:border-cyan-300",
  },
  slate: {
    iconBg: "bg-slate-100 text-slate-700 border-slate-200",
    borderHover: "hover:border-slate-300",
  },
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = "blue",
}: StatCardProps) {
  const style = colorStyles[color] || colorStyles.blue;

  return (
    <Card className={`border-slate-200 shadow-xs hover:shadow-md transition-all ${style.borderHover}`}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">{title}</p>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${style.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
          {description && (
            <p className="text-[11px] text-slate-500 mt-1 font-medium">{description}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1 text-[11px]">
              <span
                className={`font-semibold ${
                  trend.isPositive ? "text-emerald-600" : "text-slate-500"
                }`}
              >
                {trend.value}
              </span>
              <span className="text-slate-400">vs target</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
