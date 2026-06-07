"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import AdForm from "@/components/forms/AdForm";
import type { AdSlotWithDates } from "@/types";

async function fetchAdSlots(): Promise<AdSlotWithDates[]> {
  const res = await fetch("/api/admin/ads");
  if (!res.ok) throw new Error("Failed to fetch ad slots");
  const json = await res.json();
  return json.data;
}

async function deleteAdSlot(id: string): Promise<void> {
  const res = await fetch(`/api/admin/ads/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete ad slot");
}

const positionLabels: Record<string, string> = {
  TOP_BANNER: "Top Banner",
  SIDEBAR: "Sidebar",
  IN_CONTENT: "In Content",
  FOOTER: "Footer",
};

const typeLabels: Record<string, string> = {
  GOOGLE_AD: "Google AdSense",
  CUSTOM: "Custom",
};

export default function AdminAdsPage() {
  const { lang } = useLanguage();
  const queryClient = useQueryClient();
  const [editingAd, setEditingAd] = useState<AdSlotWithDates | null>(null);
  const [deletingAdId, setDeletingAdId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const { data: adSlots, isLoading, error } = useQuery({
    queryKey: ["admin", "ads"],
    queryFn: fetchAdSlots,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdSlot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "ads"] });
      setDeletingAdId(null);
      toast.success(lang === "zh" ? "广告已删除" : "Ad slot deleted");
    },
    onError: () =>
      toast.error(lang === "zh" ? "删除失败" : "Failed to delete ad slot"),
  });

  const formatValidity = (ad: AdSlotWithDates) => {
    if (ad.startDate && ad.endDate) {
      return `${formatDate(ad.startDate)} - ${formatDate(ad.endDate)}`;
    }
    if (ad.startDate) {
      return `${lang === "zh" ? "从" : "From"} ${formatDate(ad.startDate)}`;
    }
    return t("admin.unlimited", lang);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("admin.ads", lang)}</h1>
          <p className="text-sm text-muted-foreground">
            {lang === "zh"
              ? "管理广告位，添加或修改广告内容。"
              : "Manage ad slots, add or modify ad content."}
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("admin.addAd", lang)}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("admin.addAd", lang)}</DialogTitle>
              <DialogDescription>
                {lang === "zh"
                  ? "创建一个新的广告位。"
                  : "Create a new ad slot for a specific position."}
              </DialogDescription>
            </DialogHeader>
            <AdForm
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["admin", "ads"] });
                setAddOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-8 text-center">
          <p className="text-sm text-destructive">
            {lang === "zh" ? "加载广告失败" : "Failed to load ad slots."}
          </p>
        </div>
      ) : adSlots && adSlots.length > 0 ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>{t("admin.name", lang)}</TableHead>
                <TableHead>{t("admin.position", lang)}</TableHead>
                <TableHead>{t("admin.type", lang)}</TableHead>
                <TableHead>{t("admin.status", lang)}</TableHead>
                <TableHead>{t("admin.validity", lang)}</TableHead>
                <TableHead className="text-right">{t("admin.actions", lang)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adSlots.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">{ad.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {positionLabels[ad.position] || ad.position}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {typeLabels[ad.type] || ad.type}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={ad.isActive ? "default" : "secondary"}
                      className={
                        ad.isActive
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {ad.isActive ? t("admin.active", lang) : t("admin.inactive", lang)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatValidity(ad)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Dialog
                        open={editOpen && editingAd?.id === ad.id}
                        onOpenChange={(open) => {
                          setEditOpen(open);
                          if (!open) setEditingAd(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingAd(ad)}
                          >
                            <Edit className="mr-1 h-3.5 w-3.5" />
                            {t("admin.edit", lang)}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t("admin.edit", lang)}</DialogTitle>
                          </DialogHeader>
                          {editingAd && (
                            <AdForm
                              ad={editingAd}
                              onSuccess={() => {
                                queryClient.invalidateQueries({ queryKey: ["admin", "ads"] });
                                setEditingAd(null);
                                setEditOpen(false);
                              }}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeletingAdId(ad.id)}
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
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Megaphone className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">
            {lang === "zh" ? "暂无广告位" : "No ad slots found."}
          </p>
        </div>
      )}

      <AlertDialog open={!!deletingAdId} onOpenChange={() => setDeletingAdId(null)}>
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
                if (deletingAdId) deleteMutation.mutate(deletingAdId);
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