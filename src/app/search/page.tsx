"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Search, Filter } from "lucide-react"
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

async function searchSites(query: string, sort: string, page: number): Promise<PaginatedResponse<SiteWithCategory>> {
  const res = await fetch(`/api/sites?search=${encodeURIComponent(query)}&sort=${sort}&page=${page}&limit=12`)
  if (!res.ok) throw new Error("Failed to search sites")
  return res.json()
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

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { lang } = useLanguage()
  const query = searchParams.get("q") || ""
  const sort = searchParams.get("sort") || "relevance"
  const page = Number(searchParams.get("page")) || 1

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", query, sort, page],
    queryFn: () => searchSites(query, sort, page),
    enabled: query.length > 0,
  })

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", value)
    params.delete("page")
    router.push(`/search?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(newPage))
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-6">
          {/* Search Header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {query ? (
                <>
                  Results for &ldquo;<span className="text-primary">{query}</span>&rdquo;
                </>
              ) : (
                t("search.title", lang)
              )}
            </h1>
            {data && (
              <p className="mt-1 text-sm text-muted-foreground">
                {data.total} {data.total === 1 ? "result" : "results"} found
              </p>
            )}
          </div>

          {/* No query state */}
          {!query && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h2 className="text-lg font-medium">{t("search.title", lang)}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("search.noQuery", lang)}
              </p>
            </div>
          )}

          {/* Sort Tabs */}
          {query && (
            <Tabs value={sort} onValueChange={handleSortChange}>
              <TabsList>
                <TabsTrigger value="relevance">Relevance</TabsTrigger>
                <TabsTrigger value="latest">{t("category.sortLatest", lang)}</TabsTrigger>
                <TabsTrigger value="popular">{t("category.sortPopular", lang)}</TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          {/* Results */}
          {query && (
            <>
              {isLoading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <SiteCardSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <p className="text-sm text-destructive">Failed to search. Please try again.</p>
              ) : data && data.data.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {data.data.map((site) => (
                        <SiteCard
                          key={site.id}
                          site={site}
                          highlightQuery={query}
                        />
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
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                  <Filter className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h2 className="text-lg font-medium">{t("search.noResults", lang)}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    No results found for &ldquo;{query}&rdquo;. Try different keywords.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <aside className="hidden w-72 shrink-0 lg:block">
          <Sidebar />
        </aside>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SiteCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}