"use client";

import Link from "next/link";
import { Globe, FolderTree, Megaphone, Users, FileText, ChevronRight, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import { formatNumber } from "@/lib/utils";
import StatsCards from "@/components/admin/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStats } from "@/types";

const quickLinks = [
  {
    titleKey: "admin.manageSites",
    href: "/admin/sites",
    icon: Globe,
    gradient: "from-blue-500/10 to-blue-600/5",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    titleKey: "admin.manageCategories",
    href: "/admin/categories",
    icon: FolderTree,
    gradient: "from-emerald-500/10 to-emerald-600/5",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    titleKey: "admin.manageAds",
    href: "/admin/ads",
    icon: Megaphone,
    gradient: "from-amber-500/10 to-amber-600/5",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    titleKey: "admin.manageUsers",
    href: "/admin/users",
    icon: Users,
    gradient: "from-violet-500/10 to-violet-600/5",
    iconColor: "text-violet-600",
    iconBg: "bg-violet-100 dark:bg-violet-900/30",
  },
  {
    titleKey: "admin.logs",
    href: "/admin/logs",
    icon: FileText,
    gradient: "from-rose-500/10 to-rose-600/5",
    iconColor: "text-rose-600",
    iconBg: "bg-rose-100 dark:bg-rose-900/30",
  },
] as const;

export default function AdminDashboardPage() {
  const { lang } = useLanguage();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      return json.data as DashboardStats;
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("admin.title", lang)}</h1>
        <p className="mt-1 text-muted-foreground">
          {lang === "zh"
            ? "欢迎回来，以下是系统概览。"
            : "Welcome back. Here's an overview of your system."}
        </p>
      </div>

      <StatsCards />

      <div>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">
          {t("admin.quickActions", lang)}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <Card className="group relative overflow-hidden border transition-all hover:border-primary/50 hover:shadow-md">
                  <div className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
                  <CardContent className="relative flex items-center gap-4 p-5">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${link.iconBg}`}>
                      <Icon className={`h-5 w-5 ${link.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{t(link.titleKey, lang)}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4 text-muted-foreground" />
            {lang === "zh" ? "系统概览" : "System Overview"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : stats ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">{t("admin.totalSites", lang)}</p>
                <p className="mt-1 text-2xl font-bold">{formatNumber(stats.totalSites)}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">{t("admin.pendingSites", lang)}</p>
                <p className="mt-1 text-2xl font-bold text-amber-600">{formatNumber(stats.pendingSites)}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">{t("admin.totalUsers", lang)}</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600">{formatNumber(stats.totalUsers)}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">{t("admin.totalClicks", lang)}</p>
                <p className="mt-1 text-2xl font-bold text-violet-600">{formatNumber(stats.totalClicks)}</p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}