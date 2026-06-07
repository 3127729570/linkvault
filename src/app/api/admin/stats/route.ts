export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError } from "@/lib/utils";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return apiError("Unauthorized", "UNAUTHORIZED", 401);
    }
    if (session.user.role !== "ADMIN") {
      return apiError("Forbidden", "FORBIDDEN", 403);
    }

    const [totalSites, pendingSites, totalUsers, totalClicksAgg] = await Promise.all([
      prisma.site.count(),
      prisma.site.count({ where: { isApproved: false } }),
      prisma.user.count(),
      prisma.site.aggregate({ _sum: { clicks: true } }),
    ]);

    const stats = {
      totalSites,
      pendingSites,
      totalUsers,
      totalClicks: totalClicksAgg._sum.clicks ?? 0,
    };

    return apiResponse(stats);
  } catch (error) {
    console.error("Get stats error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}