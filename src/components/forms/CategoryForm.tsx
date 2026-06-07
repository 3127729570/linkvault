"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { categorySchema, type CategoryInput } from "@/lib/validations";
import { Loader2Icon, PlusIcon } from "lucide-react";
import type { CategoryWithCount } from "@/types";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";

interface CategoryFormProps {
  category?: CategoryWithCount;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export default function CategoryForm({
  category,
  trigger,
  onSuccess,
}: CategoryFormProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const isEditing = !!category;
  const { lang } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name,
          slug: category.slug,
          icon: category.icon || "",
          order: category.order,
        }
      : {
          name: "",
          slug: "",
          icon: "",
          order: 0,
        },
  });

  const mutation = useMutation({
    mutationFn: async (data: CategoryInput) => {
      const url = isEditing
        ? `/api/categories/${category!.id}`
        : "/api/categories";
      const method = isEditing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save category");
      return json.data;
    },
    onSuccess: () => {
      toast.success(isEditing ? "Category updated" : "Category created");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      setOpen(false);
      reset();
      onSuccess?.();
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (data: CategoryInput) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger || (
          <Button size="sm" type="button">
            <PlusIcon className="size-4" />
            {t("admin.addCategory", lang)}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("admin.edit", lang) : t("admin.addCategory", lang)}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the category details below"
              : "Add a new category for organizing websites"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("admin.categories", lang)}</Label>
            <Input
              id="name"
              placeholder="Category name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="category-slug"
              {...register("slug")}
            />
            {errors.slug && (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon (Lucide icon name)</Label>
            <Input
              id="icon"
              placeholder="e.g. Globe, Folder, Code"
              {...register("icon")}
            />
            {errors.icon && (
              <p className="text-xs text-destructive">{errors.icon.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              placeholder="0"
              {...register("order", { valueAsNumber: true })}
            />
            {errors.order && (
              <p className="text-xs text-destructive">{errors.order.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : null}
              {isEditing ? t("general.save", lang) : t("general.save", lang)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}