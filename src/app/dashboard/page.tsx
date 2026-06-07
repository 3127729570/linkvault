"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Edit2, Trash2, Heart, Clock, CheckCircle } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useLanguage } from "@/hooks/use-language"
import { t } from "@/lib/i18n"
import { toast } from "sonner"
import ProfileForm from "@/components/forms/ProfileForm"
import SiteSubmitForm from "@/components/forms/SiteSubmitForm"
import SiteListItem from "@/components/cards/SiteListItem"
import type { SiteWithCategory } from "@/types"

async function fetchMySubmissions(): Promise<SiteWithCategory[]> {
  const res = await fetch("/api/user/submissions")
  if (!res.ok) throw new Error("Failed to fetch submissions")
  const json = await res.json()
  return json.data
}

async function fetchMyFavorites(): Promise<SiteWithCategory[]> {
  const res = await fetch("/api/favorites")
  if (!res.ok) throw new Error("Failed to fetch favorites")
  const json = await res.json()
  return json.data
}

async function removeFavorite(siteId: string): Promise<void> {
  const res = await fetch(`/api/favorites?siteId=${siteId}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to remove favorite")
}

export default function DashboardPage() {
  const { user, loading: userLoading } = useCurrentUser()
  const { lang } = useLanguage()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const { data: submissions, isLoading: submissionsLoading } = useQuery({
    queryKey: ["user", "submissions"],
    queryFn: fetchMySubmissions,
    enabled: !!user,
  })

  const { data: favorites, isLoading: favoritesLoading } = useQuery({
    queryKey: ["user", "favorites"],
    queryFn: fetchMyFavorites,
    enabled: !!user,
  })

  const handleUnfavorite = async (siteId: string) => {
    try {
      await removeFavorite(siteId)
      queryClient.invalidateQueries({ queryKey: ["user", "favorites"] })
      toast.success("Removed from favorites")
    } catch {
      toast.error("Failed to remove favorite")
    }
  }

  if (userLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <Skeleton className="mb-6 h-32 w-full rounded-lg" />
        <Skeleton className="mb-4 h-8 w-48" />
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Please sign in to access your dashboard.</p>
      </div>
    )
  }

  const getStatusBadge = (isApproved: boolean) => {
    return isApproved ? (
      <Badge className="flex items-center gap-1 bg-green-500/10 text-green-600">
        <CheckCircle className="h-3 w-3" />
        {t("site.approved", lang)}
      </Badge>
    ) : (
      <Badge variant="secondary" className="flex items-center gap-1 text-yellow-600">
        <Clock className="h-3 w-3" />
        {t("site.pending", lang)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("dashboard.profile", lang)}</CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Edit2 className="mr-2 h-4 w-4" />
                {t("dashboard.editProfile", lang)}
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("dashboard.editProfile", lang)}</DialogTitle>
                </DialogHeader>
                <ProfileForm onSuccess={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {user.image ? (
                <AvatarImage src={user.image} alt={user.name || ""} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <Badge variant="secondary" className="mt-2">
                {user.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="submit">
        <TabsList>
          <TabsTrigger value="submit">{t("dashboard.submitTab", lang)}</TabsTrigger>
          <TabsTrigger value="submissions">{t("dashboard.mySubmissions", lang)}</TabsTrigger>
          <TabsTrigger value="favorites">{t("dashboard.myFavorites", lang)}</TabsTrigger>
        </TabsList>

        <TabsContent value="submit" className="mt-4">
          <SiteSubmitForm />
        </TabsContent>

        <TabsContent value="submissions" className="mt-4">
          {submissionsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : submissions && submissions.length > 0 ? (
            <div className="divide-y rounded-lg border">
              {submissions.map((site) => (
                <SiteListItem key={site.id} site={site}>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(site.isApproved)}
                  </div>
                </SiteListItem>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">
                {t("dashboard.noSubmissions", lang)}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-4">
          {favoritesLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : favorites && favorites.length > 0 ? (
            <div className="divide-y rounded-lg border">
              {favorites.map((site) => (
                <SiteListItem key={site.id} site={site}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnfavorite(site.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Unfavorite
                  </Button>
                </SiteListItem>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <Heart className="mx-auto mb-2 h-10 w-10 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                {t("dashboard.noFavorites", lang)}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}