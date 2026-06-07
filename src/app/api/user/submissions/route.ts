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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const [sites, total] = await Promise.all([
      prisma.site.findMany({
        where: { submitterId: session.user.id },
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.site.count({
        where: { submitterId: session.user.id },
      }),
    ]);

    return apiPaginatedResponse(sites, total, page, limit);
  } catch (error) {
    console.error("Get submissions error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}