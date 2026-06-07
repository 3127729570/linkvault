export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiPaginatedResponse, apiError } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return apiError("Unauthorized", "UNAUTHORIZED", 401);
    }
    if (session.user.role !== "ADMIN") {
      return apiError("Forbidden", "FORBIDDEN", 403);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const siteId = searchParams.get("siteId") || undefined;
    const userId = searchParams.get("userId") || undefined;

    const where: any = {};
    if (siteId) where.siteId = siteId;
    if (userId) where.userId = userId;

    const [logs, total] = await Promise.all([
      prisma.clickLog.findMany({
        where,
        include: {
          site: {
            select: { id: true, title: true, url: true },
          },
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { clickedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.clickLog.count({ where }),
    ]);

    return apiPaginatedResponse(logs, total, page, limit);
  } catch (error) {
    console.error("Get logs error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}