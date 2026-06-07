export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError, getClientIp } from "@/lib/utils";

const rateLimitMap = new Map<string, number>();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: siteId } = params;

    const ip = getClientIp(request);
    const rateLimitKey = `${ip}:${siteId}`;
    const now = Date.now();
    const lastClick = rateLimitMap.get(rateLimitKey);

    if (lastClick && now - lastClick < 60000) {
      return apiResponse({});
    }

    rateLimitMap.set(rateLimitKey, now);

    const site = await prisma.site.findUnique({
      where: { id: siteId },
    });

    if (!site) {
      return apiError("Site not found", "NOT_FOUND", 404);
    }

    const session = await auth();
    const referer = request.headers.get("referer") || null;

    await Promise.all([
      prisma.clickLog.create({
        data: {
          siteId,
          userId: session?.user?.id || null,
          ip,
          referrer: referer,
        },
      }),
      prisma.site.update({
        where: { id: siteId },
        data: { clicks: { increment: 1 } },
      }),
    ]);

    return apiResponse({});
  } catch (error) {
    console.error("Track click error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}