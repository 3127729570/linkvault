"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, GripVertical, FolderTree } from "lucide-react";
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
import CategoryForm from "@/components/forms/CategoryForm";
import type { CategoryWithCount } from "@/types";

async function fetchCategories(): Promise<CategoryWithCount[]> {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  const json = await res.json();
  return json.data;
}

async function updateCategoryOrder(id: string, order: number): Promise<void> {
  const res = await fetch(`/api/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order }),
  });
  if (!res.ok) throw new Error("Failed to update category");
}

async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete category");
}

export default function AdminCategoriesPage() {
  const { lang } = useLanguage();
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: fetchCategories,
  });

  const orderMutation = useMutation({
    mutationFn: ({ id, order }: { id: string; order: number }) =>
      updateCategoryOrder(id, order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success(lang === "zh" ? "排序已更新" : "Order updated");
    },
    onError: () =>
      toast.error(lang === "zh" ? "更新排序失败" : "Failed to update order"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      setDeletingCategoryId(null);
      toast.success(lang === "zh" ? "分类已删除" : "Category deleted");
    },
    onError: () =>
      toast.error(lang === "zh" ? "删除失败" : "Failed to delete category"),
  });

  const handleMoveUp = (index: number) => {
    if (!categories || index === 0) return;
    const current = categories[index];
    const above = categories[index - 1];
    orderMutation.mutate({ id: current.id, order: above.order });
    orderMutation.mutate({ id: above.id, order: current.order });
  };

  const handleMoveDown = (index: number) => {
    if (!categories || index === categories.length - 1) return;
    const current = categories[index];
    const below = categories[index + 1];
    orderMutation.mutate({ id: current.id, order: below.order });
    orderMutation.mutate({ id: below.id, order: current.order });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("admin.categories", lang)}
          </h1>
          <p className="text-sm text-muted-foreground">
            {lang === "zh"
              ? "管理网站分类，拖拽排序。"
              : "Manage site categories and reorder them."}
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("admin.addCategory", lang)}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("admin.addCategory", lang)}</DialogTitle>
              <DialogDescription>
                {lang === "zh"
                  ? "创建一个新的分类来组织网站。"
                  : "Create a new category for organizing sites."}
              </DialogDescription>
            </DialogHeader>
            <CategoryForm
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
                setAddOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-8 text-center">
          <p className="text-sm text-destructive">
            {lang === "zh" ? "加载分类失败" : "Failed to load categories."}
          </p>
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[100px]">{t("admin.order", lang)}</TableHead>
                <TableHead>{t("admin.name", lang)}</TableHead>
                <TableHead>{t("admin.slug", lang)}</TableHead>
                <TableHead className="text-center">
                  {lang === "zh" ? "网站数量" : "Sites"}
                </TableHead>
                <TableHead className="text-right">{t("admin.actions", lang)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        disabled={index === 0 || orderMutation.isPending}
                        onClick={() => handleMoveUp(index)}
                        title={t("admin.moveUp", lang)}
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        disabled={index === categories.length - 1 || orderMutation.isPending}
                        onClick={() => handleMoveDown(index)}
                        title={t("admin.moveDown", lang)}
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <span className="ml-1.5 text-xs text-muted-foreground tabular-nums">
                        {category.order}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {category.slug}
                    </code>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="font-normal">
                      {category._count?.sites ?? 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Dialog
                        open={editOpen && editingCategory?.id === category.id}
                        onOpenChange={(open) => {
                          setEditOpen(open);
                          if (!open) setEditingCategory(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingCategory(category)}
                          >
                            <Edit className="mr-1 h-3.5 w-3.5" />
                            {t("admin.edit", lang)}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t("admin.edit", lang)}</DialogTitle>
                          </DialogHeader>
                          {editingCategory && (
                            <CategoryForm
                              category={editingCategory}
                              onSuccess={() => {
                                queryClient.invalidateQueries({
                                  queryKey: ["admin", "categories"],
                                });
                                setEditingCategory(null);
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
                        onClick={() => setDeletingCategoryId(category.id)}
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
          <FolderTree className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">
            {lang === "zh" ? "暂无分类" : "No categories found."}
          </p>
        </div>
      )}

      <AlertDialog
        open={!!deletingCategoryId}
        onOpenChange={() => setDeletingCategoryId(null)}
      >
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
                if (deletingCategoryId) deleteMutation.mutate(deletingCategoryId);
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