"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Heart, ExternalLink, ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import AdSlot from "@/components/layout/AdSlot"
import SiteCard from "@/components/cards/SiteCard"
import { useLanguage } from "@/hooks/use-language"
import { t } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import type { SiteWithCategory } from "@/types"

async function fetchSite(id: string): Promise<SiteWithCategory> {
  const res = await fetch(`/api/sites/${id}`)
  if (!res.ok) throw new Error("Failed to fetch site")
  const json = await res.json()
  return json.data
}

async function fetchSimilarSites(categorySlug: string, excludeId: string): Promise<SiteWithCategory[]> {
  const res = await fetch(`/api/sites?categorySlug=${categorySlug}&limit=5`)
  if (!res.ok) throw new Error("Failed to fetch similar sites")
  const json = await res.json()
  return json.data.filter((s: SiteWithCategory) => s.id !== excludeId)
}

async function trackClick(siteId: string) {
  await fetch(`/api/sites/${siteId}/click`, { method: "POST" })
}

async function toggleFavorite(siteId: string, isFavorited: boolean): Promise<{ favorited: boolean }> {
  if (isFavorited) {
    const res = await fetch(`/api/favorites?siteId=${siteId}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Failed to remove favorite")
    return { favorited: false }
  } else {
    const res = await fetch(`/api/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId }),
    })
    if (!res.ok) throw new Error("Failed to add favorite")
    return { favorited: true }
  }
}

export default function SiteDetailPage() {
  const params = useParams()
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const { lang } = useLanguage()
  const id = params.id as string

  const { data: site, isLoading, error } = useQuery({
    queryKey: ["site", id],
    queryFn: () => fetchSite(id),
    enabled: !!id,
  })

  const { data: similarSites } = useQuery({
    queryKey: ["similarSites", site?.category?.slug, id],
    queryFn: () => fetchSimilarSites(site!.category.slug, id),
    enabled: !!site?.category?.slug,
  })

  const clickMutation = useMutation({
    mutationFn: () => trackClick(id),
  })

  const favoriteMutation = useMutation({
    mutationFn: () => toggleFavorite(id, !!site?.isFavorited),
    onSuccess: (data) => {
      queryClient.setQueryData(["site", id], (old: SiteWithCategory | undefined) => {
        if (!old) return old
        return { ...old, isFavorited: data.favorited }
      })
      toast.success(data.favorited ? "Added to favorites" : "Removed from favorites")
    },
    onError: () => {
      toast.error("Failed to update favorite")
    },
  })

  const handleVisit = () => {
    if (!site) return
    clickMutation.mutate()
    window.open(site.url, "_blank", "noopener,noreferrer")
  }

  const handleFavorite = () => {
    if (!session) {
      toast.error(t("auth.pleaseLogin", lang))
      return
    }
    favoriteMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="mb-4 h-8 w-24" />
        <div className="flex flex-col gap-6 md:flex-row">
          <Skeleton className="h-48 w-48 rounded-xl" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !site) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Site Not Found</h1>
        <p className="mt-2 text-muted-foreground">The site you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Go Home
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      {/* Site header */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Logo */}
        {site.logo ? (
          <img
            src={site.logo}
            alt={site.title}
            className="h-48 w-48 shrink-0 rounded-xl border object-cover"
          />
        ) : (
          <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded-xl border bg-muted">
            <span className="text-4xl font-bold text-muted-foreground">
              {site.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Info */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold tracking-tight">{site.title}</h1>
          <p className="text-muted-foreground">{site.description}</p>

          {/* Tags */}
          {site.tags && site.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {site.tags.map((tag) => (
                <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Category */}
          {site.category && (
            <Link
              href={`/category/${site.category.slug}`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
            >
              {t("site.category", lang)}: <span className="font-medium">{site.category.name}</span>
            </Link>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleVisit} size="lg">
              <ExternalLink className="mr-2 h-4 w-4" />
              {t("site.visit", lang)}
            </Button>
            <Button
              variant={site.isFavorited ? "default" : "outline"}
              size="lg"
              onClick={handleFavorite}
              disabled={favoriteMutation.isPending}
            >
              <Heart
                className={cn("mr-2 h-4 w-4", site.isFavorited && "fill-current")}
              />
              {site.isFavorited ? "Favorited" : "Favorite"}
            </Button>
          </div>
        </div>
      </div>

      {/* In-Content Ad */}
      <AdSlot position="IN_CONTENT" />

      {/* Similar Sites */}
      {similarSites && similarSites.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold tracking-tight">{t("site.similarSites", lang)}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {similarSites.map((s) => (
              <SiteCard key={s.id} site={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}