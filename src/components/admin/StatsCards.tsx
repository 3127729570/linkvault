"use client";

import { useQuery } from "@tanstack/react-query";
import { Globe, Clock, Users, MousePointerClick } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import { formatNumber } from "@/lib/utils";
import type { DashboardStats } from "@/types";

const statCards = [
  {
    key: "totalSites" as const,
    labelKey: "admin.totalSites" as const,
    icon: Globe,
    gradient: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    key: "pendingSites" as const,
    labelKey: "admin.pendingSites" as const,
    icon: Clock,
    gradient: "from-amber-500/20 to-amber-600/10",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    key: "totalUsers" as const,
    labelKey: "admin.totalUsers" as const,
    icon: Users,
    gradient: "from-emerald-500/20 to-emerald-600/10",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    key: "totalClicks" as const,
    labelKey: "admin.totalClicks" as const,
    icon: MousePointerClick,
    gradient: "from-violet-500/20 to-violet-600/10",
    iconColor: "text-violet-600",
    iconBg: "bg-violet-100 dark:bg-violet-900/30",
  },
];

export default function StatsCards() {
  const { lang } = useLanguage();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      return json.data as DashboardStats;
    },
    refetchInterval: 30000,
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        const value = data ? data[stat.key] : 0;

        return (
          <div
            key={stat.key}
            className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50`} />
            <div className="relative flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {t(stat.labelKey, lang)}
                </p>
                {isLoading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  <p className="text-3xl font-bold tracking-tight">
                    {typeof value === "number" ? formatNumber(value) : value}
                  </p>
                )}
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg}`}>
                <Icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}