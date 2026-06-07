"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import AdSlot from "@/components/layout/AdSlot"
import Sidebar from "@/components/layout/Sidebar"
import SiteCard from "@/components/cards/SiteCard"
import CategoryCard from "@/components/cards/CategoryCard"
import { useLanguage } from "@/hooks/use-language"
import { t } from "@/lib/i18n"
import type { SiteWithCategory, CategoryWithCount, PaginatedResponse } from "@/types"

async function fetchPopularSites(): Promise<SiteWithCategory[]> {
  const res = await fetch("/api/sites?sort=popular&limit=12")
  if (!res.ok) throw new Error("Failed to fetch popular sites")
  const json = await res.json()
  return json.data
}

async function fetchLatestSites(): Promise<SiteWithCategory[]> {
  const res = await fetch("/api/sites?sort=latest&limit=8")
  if (!res.ok) throw new Error("Failed to fetch latest sites")
  const json = await res.json()
  return json.data
}

async function fetchCategories(): Promise<CategoryWithCount[]> {
  const res = await fetch("/api/categories")
  if (!res.ok) throw new Error("Failed to fetch categories")
  const json = await res.json()
  return json.data
}

function SiteCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
    </div>
  )
}

function CategoryCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="mx-auto h-12 w-12 rounded-full" />
      <Skeleton className="mx-auto h-4 w-2/3" />
      <Skeleton className="mx-auto h-3 w-1/3" />
    </div>
  )
}

export default function HomePage() {
  const { lang } = useLanguage()

  const {
    data: popularSites,
    isLoading: popularLoading,
    error: popularError,
  } = useQuery({
    queryKey: ["sites", "popular"],
    queryFn: fetchPopularSites,
  })

  const {
    data: latestSites,
    isLoading: latestLoading,
    error: latestError,
  } = useQuery({
    queryKey: ["sites", "latest"],
    queryFn: fetchLatestSites,
  })

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-10">
          {/* Top Banner Ad */}
          <AdSlot position="TOP_BANNER" />

          {/* Popular Sites */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">{t("home.featured", lang)}</h2>
              <Link href="/search?sort=popular" className="text-sm text-muted-foreground hover:text-primary">
                {t("home.viewAll", lang)} →
              </Link>
            </div>
            {popularLoading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SiteCardSkeleton key={i} />
                ))}
              </div>
            ) : popularError ? (
              <p className="text-sm text-destructive">Failed to load popular sites.</p>
            ) : popularSites && popularSites.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {popularSites.map((site) => (
                  <SiteCard key={site.id} site={site} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">
                  {t("home.empty", lang)}{" "}
                  <Link href="/dashboard" className="font-medium text-primary hover:underline">
                    {t("home.submitNow", lang)}
                  </Link>
                </p>
              </div>
            )}
          </section>

          {/* Latest Sites */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">{t("home.latest", lang)}</h2>
              <Link href="/search?sort=latest" className="text-sm text-muted-foreground hover:text-primary">
                {t("home.viewAll", lang)} →
              </Link>
            </div>
            {latestLoading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SiteCardSkeleton key={i} />
                ))}
              </div>
            ) : latestError ? (
              <p className="text-sm text-destructive">Failed to load latest sites.</p>
            ) : latestSites && latestSites.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {latestSites.map((site) => (
                  <SiteCard key={site.id} site={site} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">
                  {t("home.empty", lang)}{" "}
                  <Link href="/dashboard" className="font-medium text-primary hover:underline">
                    {t("home.submitNow", lang)}
                  </Link>
                </p>
              </div>
            )}
          </section>

          {/* Categories */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">{t("home.categories", lang)}</h2>
              <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary">
                {t("home.viewAll", lang)} →
              </Link>
            </div>
            {categoriesLoading ? (
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CategoryCardSkeleton key={i} />
                ))}
              </div>
            ) : categoriesError ? (
              <p className="text-sm text-destructive">Failed to load categories.</p>
            ) : categories && categories.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No categories available.</p>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <Sidebar />
        </aside>
      </div>

      {/* Sidebar on mobile - below content */}
      <aside className="mt-6 lg:hidden">
        <Sidebar />
      </aside>
    </div>
  )
}