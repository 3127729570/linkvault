"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Check, X, ExternalLink, Trash2, Globe } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import type { SiteWithCategory, PaginatedResponse } from "@/types";

const PAGE_SIZE = 10;

type TabType = "all" | "pending" | "approved";

async function fetchSites(
  page: number,
  search: string
): Promise<PaginatedResponse<SiteWithCategory>> {
  let url = `/api/sites?approved=false&page=${page}&limit=${PAGE_SIZE}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch sites");
  return res.json();
}

async function toggleApprove(id: string, isApproved: boolean): Promise<void> {
  const res = await fetch(`/api/sites/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isApproved: !isApproved }),
  });
  if (!res.ok) throw new Error("Failed to update site");
}

async function deleteSite(id: string): Promise<void> {
  const res = await fetch(`/api/sites/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete site");
}

export default function AdminSitesPage() {
  const { lang } = useLanguage();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<TabType>("all");
  const [search, setSearch] = useState("");
  const [deletingSiteId, setDeletingSiteId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "sites", page, search],
    queryFn: () => fetchSites(page, search),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, isApproved }: { id: string; isApproved: boolean }) =>
      toggleApprove(id, isApproved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sites"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success(lang === "zh" ? "网站状态已更新" : "Site status updated");
    },
    onError: () => toast.error(lang === "zh" ? "更新失败" : "Failed to update site"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sites"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      setDeletingSiteId(null);
      toast.success(lang === "zh" ? "网站已删除" : "Site deleted");
    },
    onError: () => toast.error(lang === "zh" ? "删除失败" : "Failed to delete site"),
  });

  const allSites = data?.data ?? [];
  const filteredSites =
    tab === "all"
      ? allSites
      : tab === "pending"
        ? allSites.filter((s) => !s.isApproved)
        : allSites.filter((s) => s.isApproved);

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  const tabs: { value: TabType; labelKey: string }[] = [
    { value: "all", labelKey: "admin.all" },
    { value: "pending", labelKey: "admin.pendingSites" },
    { value: "approved", labelKey: "site.approved" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("admin.sites", lang)}</h1>
          <p className="text-sm text-muted-foreground">
            {lang === "zh"
              ? "管理所有提交的网站，审批或删除。"
              : "Manage all submitted sites, approve or delete."}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {tabs.map((tabItem) => (
            <Button
              key={tabItem.value}
              variant={tab === tabItem.value ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setTab(tabItem.value as TabType);
                setPage(1);
              }}
              className="text-sm"
            >
              {tabItem.value === "all"
                ? t("admin.all", lang)
                : tabItem.value === "pending"
                  ? t("admin.pendingSites", lang)
                  : t("site.approved", lang)}
              {tabItem.value === "pending" && data && (
                <span className="ml-1.5 rounded-full bg-amber-500/20 px-1.5 text-xs text-amber-600">
                  {allSites.filter((s) => !s.isApproved).length}
                </span>
              )}
            </Button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={lang === "zh" ? "搜索网站..." : "Search sites..."}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-8 text-center">
          <p className="text-sm text-destructive">
            {lang === "zh" ? "加载网站失败" : "Failed to load sites."}
          </p>
        </div>
      ) : filteredSites.length > 0 ? (
        <>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>{t("admin.siteTitle", lang)}</TableHead>
                  <TableHead>{t("admin.url", lang)}</TableHead>
                  <TableHead>{t("admin.category", lang)}</TableHead>
                  <TableHead>{t("admin.clicks", lang)}</TableHead>
                  <TableHead>{t("admin.status", lang)}</TableHead>
                  <TableHead className="text-right">{t("admin.actions", lang)}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {site.logo && (
                          <img
                            src={site.logo}
                            alt=""
                            className="h-5 w-5 rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        )}
                        <span className="max-w-[180px] truncate">{site.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 max-w-[200px] truncate text-muted-foreground hover:text-primary"
                      >
                        <span className="truncate">{site.url}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {site.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="tabular-nums">{site.clicks}</TableCell>
                    <TableCell>
                      <Badge
                        variant={site.isApproved ? "default" : "secondary"}
                        className={
                          site.isApproved
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        }
                      >
                        {site.isApproved
                          ? t("site.approved", lang)
                          : t("site.pending", lang)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant={site.isApproved ? "outline" : "default"}
                          onClick={() =>
                            approveMutation.mutate({
                              id: site.id,
                              isApproved: site.isApproved,
                            })
                          }
                          disabled={approveMutation.isPending}
                        >
                          {site.isApproved ? (
                            <X className="mr-1 h-3.5 w-3.5" />
                          ) : (
                            <Check className="mr-1 h-3.5 w-3.5" />
                          )}
                          {site.isApproved
                            ? t("admin.reject", lang)
                            : t("admin.approve", lang)}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setDeletingSiteId(site.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => page > 1 && setPage(page - 1)}
                    className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === page}
                      onClick={() => setPage(p)}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => page < totalPages && setPage(page + 1)}
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
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Globe className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">
            {lang === "zh" ? "没有找到网站" : "No sites found."}
          </p>
        </div>
      )}

      <AlertDialog open={!!deletingSiteId} onOpenChange={() => setDeletingSiteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.confirmDelete", lang)}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.confirmDeleteDesc", lang)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("general.cancel", lang)}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deletingSiteId) deleteMutation.mutate(deletingSiteId);
              }}
              disabled={deleteMutation.isPending}
            >
              {t("admin.delete", lang)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}