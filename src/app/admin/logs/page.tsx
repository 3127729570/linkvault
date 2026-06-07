"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { formatDate } from "@/lib/utils";

interface ClickLogEntry {
  id: string;
  siteId: string;
  userId: string | null;
  ip: string | null;
  referrer: string | null;
  clickedAt: string;
  site: {
    id: string;
    title: string;
    url: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface LogsResponse {
  data: ClickLogEntry[];
  total: number;
  page: number;
  limit: number;
}

async function fetchLogs(page: number): Promise<LogsResponse> {
  const res = await fetch(`/api/admin/logs?page=${page}&limit=20`);
  if (!res.ok) throw new Error("Failed to fetch logs");
  return res.json();
}

export default function AdminLogsPage() {
  const { lang } = useLanguage();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "logs", page],
    queryFn: () => fetchLogs(page),
  });

  const logs = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {lang === "zh" ? "日志管理" : "Log Management"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {lang === "zh"
            ? "查看网站的点击日志记录。"
            : "View click log records for websites."}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-8 text-center">
          <p className="text-sm text-destructive">
            {lang === "zh" ? "加载日志失败" : "Failed to load logs."}
          </p>
        </div>
      ) : logs.length > 0 ? (
        <>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[180px]">
                    {lang === "zh" ? "时间" : "Time"}
                  </TableHead>
                  <TableHead>
                    {lang === "zh" ? "网站" : "Website"}
                  </TableHead>
                  <TableHead>
                    {lang === "zh" ? "用户" : "User"}
                  </TableHead>
                  <TableHead>
                    {lang === "zh" ? "IP" : "IP"}
                  </TableHead>
                  <TableHead className="w-[100px]">
                    {lang === "zh" ? "来源" : "Referrer"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(log.clickedAt)}{" "}
                      {new Date(log.clickedAt).toLocaleTimeString("zh-CN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate max-w-[200px]">
                          {log.site.title}
                        </span>
                        <a
                          href={log.site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary shrink-0"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.user ? (
                        <span className="text-sm">
                          {log.user.name || log.user.email}
                        </span>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          {lang === "zh" ? "游客" : "Guest"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">
                      {log.ip || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.referrer ? (
                        <span className="truncate block max-w-[120px]" title={log.referrer}>
                          {log.referrer}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {lang === "zh"
                  ? `共 ${total} 条记录，第 ${page}/${totalPages} 页`
                  : `Total ${total} records, page ${page}/${totalPages}`}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {lang === "zh" ? "上一页" : "Prev"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  {lang === "zh" ? "下一页" : "Next"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <FileText className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">
            {lang === "zh" ? "暂无日志记录" : "No log records found."}
          </p>
        </div>
      )}
    </div>
  );
}