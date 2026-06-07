"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import AdSlot from "@/components/layout/AdSlot";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GlobeIcon, EyeIcon } from "lucide-react";
import { truncate, formatNumber } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import type { SiteWithCategory } from "@/types";

export default function Sidebar() {
  const { lang } = useLanguage();

  const { data, isLoading } = useQuery({
    queryKey: ["sites", "popular"],
    queryFn: async () => {
      const res = await fetch("/api/sites?sort=popular&limit=10");
      const json = await res.json();
      return (json.data || []) as SiteWithCategory[];
    },
  });

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-20 space-y-6">
        {/* Popular Sites */}
        <div className="rounded-xl border bg-card p-4">
          <h3 className="text-sm font-medium mb-3">
            {t("home.featured", lang)}
          </h3>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : data && data.length > 0 ? (
            <ul className="space-y-1">
              {data.map((site) => (
                <li key={site.id}>
                  <Link
                    href={`/site/${site.id}`}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted transition-colors"
                  >
                    <Avatar className="size-6 shrink-0">
                      {site.logo ? (
                        <AvatarImage src={site.logo} alt={site.title} />
                      ) : (
                        <AvatarFallback>
                          <GlobeIcon className="size-3" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {truncate(site.title, 18)}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <EyeIcon className="size-3" />
                        <span>{formatNumber(site.clicks)}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t("home.empty", lang)}
            </p>
          )}
        </div>

        {/* Ad */}
        <AdSlot position="SIDEBAR" />
      </div>
    </aside>
  );
}