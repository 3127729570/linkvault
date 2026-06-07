"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shield, ShieldOff, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useCurrentUser } from "@/hooks/use-current-user";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import type { SafeUser } from "@/types";

interface AdminUser extends SafeUser {
  createdAt?: string | Date;
}

async function fetchUsers(): Promise<SafeUser[]> {
  const res = await fetch("/api/admin/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  const json = await res.json();
  return json.data;
}

async function toggleUserRole(userId: string): Promise<void> {
  const res = await fetch(`/api/admin/users/${userId}/role`, {
    method: "PATCH",
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "Failed to update user role");
  }
}

export default function AdminUsersPage() {
  const { user: currentUser } = useCurrentUser();
  const { lang } = useLanguage();
  const queryClient = useQueryClient();
  const [toggleUserId, setToggleUserId] = useState<string | null>(null);
  const [toggleUserName, setToggleUserName] = useState<string>("");
  const [toggleUserCurrentRole, setToggleUserCurrentRole] = useState<string>("");

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: fetchUsers,
  });

  const roleMutation = useMutation({
    mutationFn: (userId: string) => toggleUserRole(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setToggleUserId(null);
      toast.success(lang === "zh" ? "用户角色已更新" : "User role updated");
    },
    onError: (err: Error) => {
      toast.error(err.message || (lang === "zh" ? "更新失败" : "Failed to update user role"));
      setToggleUserId(null);
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("admin.users", lang)}</h1>
        <p className="text-sm text-muted-foreground">
          {lang === "zh"
            ? "管理用户角色和权限。"
            : "Manage user roles and permissions."}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-8 text-center">
          <p className="text-sm text-destructive">
            {lang === "zh" ? "加载用户失败" : "Failed to load users."}
          </p>
        </div>
      ) : users && users.length > 0 ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>{t("admin.name", lang)}</TableHead>
                <TableHead>{t("admin.email", lang)}</TableHead>
                <TableHead>{t("admin.role", lang)}</TableHead>
                <TableHead>{t("admin.joined", lang)}</TableHead>
                <TableHead className="text-right">{t("admin.actions", lang)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const isSelf = currentUser?.id === user.id;
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name || ""}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{user.name || "—"}</p>
                          {isSelf && (
                            <p className="text-xs text-muted-foreground">
                              {lang === "zh" ? "（当前用户）" : "(you)"}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === "ADMIN" ? "default" : "secondary"}
                        className={
                          user.role === "ADMIN"
                            ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                            : ""
                        }
                      >
                        {user.role === "ADMIN"
                          ? t("admin.roleAdmin", lang)
                          : t("admin.roleUser", lang)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {(user as AdminUser).createdAt
                        ? formatDate((user as AdminUser).createdAt!)
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={user.role === "ADMIN" ? "outline" : "default"}
                        onClick={() => {
                          setToggleUserId(user.id);
                          setToggleUserName(user.name || user.email);
                          setToggleUserCurrentRole(user.role);
                        }}
                        disabled={isSelf || roleMutation.isPending}
                        title={isSelf ? (lang === "zh" ? "不能修改自己的角色" : "Cannot modify your own role") : undefined}
                      >
                        {user.role === "ADMIN" ? (
                          <>
                            <ShieldOff className="mr-1.5 h-3.5 w-3.5" />
                            {lang === "zh" ? "降级" : "Demote"}
                          </>
                        ) : (
                          <>
                            <Shield className="mr-1.5 h-3.5 w-3.5" />
                            {lang === "zh" ? "升级" : "Promote"}
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Users className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">
            {lang === "zh" ? "暂无用户" : "No users found."}
          </p>
        </div>
      )}

      <AlertDialog open={!!toggleUserId} onOpenChange={() => setToggleUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.toggleRole", lang)}</AlertDialogTitle>
            <AlertDialogDescription>
              {toggleUserCurrentRole === "ADMIN"
                ? (lang === "zh"
                    ? `确定要将 "${toggleUserName}" 降级为普通用户吗？他们将失去管理员权限。`
                    : `Are you sure you want to demote "${toggleUserName}"? They will lose admin privileges.`)
                : (lang === "zh"
                    ? `确定要将 "${toggleUserName}" 升级为管理员吗？他们将获得完整的管理权限。`
                    : `Are you sure you want to promote "${toggleUserName}" to admin? They will gain full access.`)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("general.cancel", lang)}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toggleUserId) roleMutation.mutate(toggleUserId);
              }}
              disabled={roleMutation.isPending}
            >
              {t("general.confirm", lang)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}