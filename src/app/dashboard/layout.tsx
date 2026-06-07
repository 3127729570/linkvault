"use client"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/hooks/use-language"
import { t } from "@/lib/i18n"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage()

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}