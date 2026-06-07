"use client"

import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { t } from "@/lib/i18n"

export default function NotFoundPage() {
  const { lang } = useLanguage()

  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center px-4">
      <FileQuestion className="mb-4 h-16 w-16 text-muted-foreground" />
      <h1 className="text-3xl font-bold">{t("general.notFound", lang)}</h1>
      <p className="mt-2 max-w-md text-center text-muted-foreground">
        {t("general.notFoundDesc", lang)}
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {t("general.goHome", lang)}
      </Link>
    </div>
  )
}