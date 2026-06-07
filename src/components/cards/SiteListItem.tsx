"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import { cn, truncate, formatNumber } from "@/lib/utils";
import {
  GlobeIcon,
  HeartIcon,
  ExternalLinkIcon,
  EyeIcon,
} from "lucide-react";
import type { SiteWithCategory } from "@/types";

interface SiteListItemProps {
  site: SiteWithCategory;
  onFavoriteToggle?: (siteId: string, isFavorited: boolean) => void;
  children?: React.ReactNode;
}

export default function SiteListItem({ site, onFavoriteToggle, children }: SiteListItemProps) {
  const { isAuthenticated } = useCurrentUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { lang } = useLanguage();

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (site.isFavorited) {
        const res = await fetch(`/api/favorites?siteId=${site.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to remove favorite");
        return false;
      } else {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ siteId: site.id }),
        });
        if (!res.ok) throw new Error("Failed to add favorite");
        return true;
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["sites"] });
      const newFavState = !site.isFavorited;
      if (onFavoriteToggle) {
        onFavoriteToggle(site.id, newFavState);
      }
      return { newFavState };
    },
    onError: (_err, _vars, context) => {
      if (onFavoriteToggle && context) {
        onFavoriteToggle(site.id, !context.newFavState);
      }
      toast.error("Failed to update favorite");
    },
    onSuccess: (isNowFavorited) => {
      toast.success(isNowFavorited ? "Added to favorites" : "Removed from favorites");
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error(t("auth.pleaseLogin", lang));
      router.push("/login");
      return;
    }
    favoriteMutation.mutate();
  };

  const handleVisit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId: site.id }),
    }).catch(() => {});
    window.open(site.url, "_blank");
  };

  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-4 hover:ring-1 hover:ring-primary/30 transition-all">
      <Link href={`/site/${site.id}`} className="flex items-center gap-4 flex-1 min-w-0">
        <Avatar className="shrink-0">
          {site.logo ? (
            <AvatarImage src={site.logo} alt={site.title} />
          ) : (
            <AvatarFallback>
              <GlobeIcon className="size-4" />
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium truncate">
            {truncate(site.title, 30)}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {truncate(site.description, 60)}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant="secondary" className="text-xs">
              {site.category?.name || "Uncategorized"}
            </Badge>
            {site.tags?.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
              <EyeIcon className="size-3" />
              {formatNumber(site.clicks)}
            </span>
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-1 shrink-0">
        {children ? (
          children
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavoriteClick}
              aria-label={site.isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <HeartIcon
                className={cn(
                  "size-3.5",
                  site.isFavorited && "fill-red-500 text-red-500"
                )}
              />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleVisit}
            >
              <ExternalLinkIcon className="size-3" />
              {t("site.visit", lang)}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}