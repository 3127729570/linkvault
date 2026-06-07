export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiPaginatedResponse, apiResponse, apiError } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return apiError("Unauthorized", "UNAUTHORIZED", 401);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId: session.user.id },
        include: {
          site: {
            include: {
              category: { select: { id: true, name: true, slug: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.favorite.count({
        where: { userId: session.user.id },
      }),
    ]);

    // Extract sites from favorites and mark as favorited
    const sites = favorites.map((fav) => ({
      ...fav.site,
      isFavorited: true,
    }));

    return apiPaginatedResponse(sites, total, page, limit);
  } catch (error) {
    console.error("Get favorites error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return apiError("Unauthorized", "UNAUTHORIZED", 401);
    }

    const body = await request.json();
    const { siteId } = body;

    if (!siteId) {
      return apiError("siteId is required", "VALIDATION_ERROR", 400);
    }

    const site = await prisma.site.findUnique({
      where: { id: siteId },
    });

    if (!site) {
      return apiError("Site not found", "NOT_FOUND", 404);
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        siteId,
      },
      include: {
        site: {
          include: {
            category: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });

    return apiResponse(favorite, 201);
  } catch (error: any) {
    if (error?.code === "P2002") {
      return apiError("Already favorited", "ALREADY_FAVORITED", 409);
    }
    console.error("Create favorite error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return apiError("Unauthorized", "UNAUTHORIZED", 401);
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId");

    if (!siteId) {
      return apiError("siteId query parameter is required", "VALIDATION_ERROR", 400);
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_siteId: {
          userId: session.user.id,
          siteId,
        },
      },
    });

    if (!existing) {
      return apiError("Favorite not found", "NOT_FOUND", 404);
    }

    await prisma.favorite.delete({
      where: {
        userId_siteId: {
          userId: session.user.id,
          siteId,
        },
      },
    });

    return apiResponse({ success: true });
  } catch (error) {
    console.error("Delete favorite error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}