"use client";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { CategoryWithCount } from "@/types";

interface CategoryCardProps {
  category: CategoryWithCount;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const { lang } = useLanguage();
  const iconName = category.icon || "Folder";
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Globe;

  return (
    <Link href={`/category/${category.slug}`}>
      <Card className="group/card hover:ring-1 hover:ring-primary/30 transition-all cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary"
              )}
            >
              <IconComponent className="size-5" />
            </div>
            <Badge variant="secondary" className="text-xs">
              {category._count?.sites ?? 0} {t("admin.sites", lang)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle className="text-sm">{category.name}</CardTitle>
        </CardContent>
      </Card>
    </Link>
  );
}