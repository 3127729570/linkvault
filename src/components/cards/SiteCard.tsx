"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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

interface SiteCardProps {
  site: SiteWithCategory;
  onFavoriteToggle?: (siteId: string, isFavorited: boolean) => void;
  highlightQuery?: string;
}

export default function SiteCard({ site, onFavoriteToggle, highlightQuery: _highlightQuery }: SiteCardProps) {
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
    e.stopPropagation();
    fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId: site.id }),
    }).catch(() => {});
  };

  return (
    <Card className="group/card hover:ring-1 hover:ring-primary/30 transition-all cursor-pointer" onClick={() => router.push(`/site/${site.id}`)}>
      <CardHeader>
        <div className="flex items-start gap-3">
          <Avatar className="size-6 shrink-0 mt-0.5">
            {site.logo ? (
              <AvatarImage src={site.logo} alt={site.title} />
            ) : (
              <AvatarFallback>
                <GlobeIcon className="size-3" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium truncate">
                {truncate(site.title, 20)}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
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
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {truncate(site.description, 80)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary">
            {site.category?.name || "Uncategorized"}
          </Badge>
          {site.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <EyeIcon className="size-3" />
            <span>{formatNumber(site.clicks)}{t("site.clicks", lang)}</span>
          </div>
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleVisit}
            className="inline-flex items-center justify-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <ExternalLinkIcon className="size-3" />
            {t("site.visit", lang)}
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}