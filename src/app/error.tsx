"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { t } from "@/lib/i18n"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { lang } = useLanguage()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center px-4">
      <AlertTriangle className="mb-4 h-12 w-12 text-destructive" />
      <h1 className="text-2xl font-bold">{t("general.error", lang)}</h1>
      <p className="mt-2 max-w-md text-center text-muted-foreground">
        An unexpected error occurred. Please try again or contact support if the problem persists.
      </p>
      {error.digest && (
        <p className="mt-1 text-xs text-muted-foreground">
          Error ID: {error.digest}
        </p>
      )}
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>{t("general.retry", lang)}</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          {t("general.goHome", lang)}
        </Button>
      </div>
    </div>
  )
}