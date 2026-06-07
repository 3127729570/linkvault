"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentUser } from "@/hooks/use-current-user";
import { siteSchema, type SiteInput } from "@/lib/validations";
import { Loader2Icon } from "lucide-react";
import type { CategoryWithCount } from "@/types";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";

export default function SiteSubmitForm() {
  const { isAuthenticated } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const { lang } = useLanguage();

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      const json = await res.json();
      return (json.data || []) as CategoryWithCount[];
    },
  });

  const categories = categoriesData || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SiteInput>({
    resolver: zodResolver(siteSchema) as any,
    defaultValues: {
      title: "",
      url: "",
      description: "",
      categoryId: "",
      tags: [],
    },
  });

  const categoryId = watch("categoryId");

  const onSubmit = async (data: SiteInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || t("submit.failed", lang));
        return;
      }

      toast.success(t("submit.success", lang));
      reset();
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t("auth.pleaseLogin", lang)}</p>
      </div>
    );
  }

  const handleCategoryChange = (value: string | null) => {
    if (value) setValue("categoryId", value, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">{t("submit.siteTitle", lang)}</Label>
        <Input
          id="title"
          placeholder="Site title"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">{t("submit.url", lang)}</Label>
        <Input
          id="url"
          placeholder="https://example.com"
          {...register("url")}
        />
        {errors.url && (
          <p className="text-xs text-destructive">{errors.url.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("submit.siteDescription", lang)}</Label>
        <Textarea
          id="description"
          placeholder="Describe the site (at least 10 characters)"
          rows={3}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">{t("submit.category", lang)}</Label>
        <Select
          value={categoryId}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("submit.selectCategory", lang)} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-xs text-destructive">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">{t("submit.tags", lang)}</Label>
        <Input
          id="tags"
          placeholder="e.g. design, tools, inspiration"
          onChange={(e) => {
            const tags = e.target.value
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
            setValue("tags", tags, { shouldValidate: true });
          }}
        />
        {errors.tags && (
          <p className="text-xs text-destructive">{errors.tags.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : null}
        {t("submit.submitBtn", lang)}
      </Button>
    </form>
  );
}