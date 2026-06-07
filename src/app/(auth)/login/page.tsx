"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LoginForm from "@/components/forms/LoginForm"
import { useLanguage } from "@/hooks/use-language"
import { t } from "@/lib/i18n"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const { lang } = useLanguage()

  useEffect(() => {
    if (error) {
      const errorMessages: Record<string, string> = {
        CredentialsSignin: "Invalid email or password. Please try again.",
        OAuthAccountNotLinked: "This email is already associated with another sign-in method.",
        OAuthSignin: "Could not sign in with the selected provider. Please try again.",
        OAuthCallback: "Could not complete the OAuth sign-in. Please try again.",
        default: "An error occurred during sign in. Please try again.",
      }
      toast.error(errorMessages[error] || errorMessages.default)
    }
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("auth.welcomeBack", lang)}</CardTitle>
          <CardDescription>{t("auth.signIn", lang)}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}