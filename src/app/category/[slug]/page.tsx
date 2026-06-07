"use client"

import { useParams, useSearchParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Sidebar from "@/components/layout/Sidebar"
import SiteCard from "@/components/cards/SiteCard"
import { useLanguage } from "@/hooks/use-language"
import { t } from "@/lib/i18n"
import type { SiteWithCategory, PaginatedResponse } from "@/types"

async function fetchSitesByCategory(
  slug: string,
  sort: string,
  page: number
): Promise<PaginatedResponse<SiteWithCategory>> {
  const res = await fetch(`/api/sites?categorySlug=${slug}&sort=${sort}&page=${page}&limit=12`)
  if (!res.ok) throw new Error("Failed to fetch sites")
  return res.json()
}

async function fetchCategory(slug: string): Promise<{ id: string; name: string; slug: string }> {
  const res = await fetch(`/api/categories/${slug}`)
  if (!res.ok) throw new Error("Failed to fetch category")
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

export default function CategoryPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { lang } = useLanguage()
  const slug = params.slug as string
  const sort = searchParams.get("sort") || "latest"
  const page = Number(searchParams.get("page")) || 1

  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ["category", slug],
    queryFn: () => fetchCategory(slug),
    enabled: !!slug,
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ["sites", "category", slug, sort, page],
    queryFn: () => fetchSitesByCategory(slug, sort, page),
    enabled: !!slug,
  })

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", value)
    params.delete("page")
    router.push(`/category/${slug}?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(newPage))
    router.push(`/category/${slug}?${params.toString()}`)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-6">
          {/* Category Heading */}
          <div>
            {categoryLoading ? (
              <Skeleton className="h-8 w-48" />
            ) : (
              <h1 className="text-2xl font-bold tracking-tight">
                {category?.name || slug}
              </h1>
            )}
          </div>

          {/* Sort Tabs */}
          <Tabs value={sort} onValueChange={handleSortChange}>
            <TabsList>
              <TabsTrigger value="latest">{t("category.sortLatest", lang)}</TabsTrigger>
              <TabsTrigger value="popular">{t("category.sortPopular", lang)}</TabsTrigger>
              <TabsTrigger value="name">{t("category.sortName", lang)}</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Sites Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SiteCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">Failed to load sites.</p>
          ) : data && data.data.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {data.data.map((site) => (
                  <SiteCard key={site.id} site={site} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => page > 1 && handlePageChange(page - 1)}
                        className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          isActive={p === page}
                          onClick={() => handlePageChange(p)}
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => page < totalPages && handlePageChange(page + 1)}
                        className={
                          page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">{t("category.noSites", lang)}</p>
            </div>
          )}
        </div>

        <aside className="hidden w-72 shrink-0 lg:block">
          <Sidebar />
        </aside>
      </div>
    </div>
  )
}