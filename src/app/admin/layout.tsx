"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Globe, FolderTree, Megaphone, Users, FileText, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsAdmin } from "@/hooks/use-current-user";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { titleKey: "admin.dashboard", href: "/admin", icon: LayoutDashboard },
  { titleKey: "admin.sites", href: "/admin/sites", icon: Globe },
  { titleKey: "admin.categories", href: "/admin/categories", icon: FolderTree },
  { titleKey: "admin.ads", href: "/admin/ads", icon: Megaphone },
  { titleKey: "admin.users", href: "/admin/users", icon: Users },
  { titleKey: "admin.logs", href: "/admin/logs", icon: FileText },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = useIsAdmin();
  const { lang } = useLanguage();
  const pathname = usePathname();

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <LayoutDashboard className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("admin.accessDenied", lang)}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {lang === "zh"
              ? "您需要管理员权限才能访问此页面。"
              : "You need administrator privileges to access this page."}
          </p>
          <Button asChild className="mt-6">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("general.goHome", lang)}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl">
      <aside className="hidden w-56 shrink-0 border-r bg-muted/30 lg:block">
        <div className="flex h-full flex-col">
          <div className="px-4 py-5">
            <h2 className="text-lg font-semibold tracking-tight">
              {t("admin.title", lang)}
            </h2>
            <p className="text-xs text-muted-foreground">
              {lang === "zh" ? "管理您的网站和用户" : "Manage your sites and users"}
            </p>
          </div>
          <Separator />
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 font-normal",
                      isActive &&
                        "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
                    {t(item.titleKey, lang)}
                  </Button>
                </Link>
              );
            })}
          </nav>
          <Separator />
          <div className="p-4">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                {t("general.goHome", lang)}
              </Link>
            </Button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden px-4 py-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}