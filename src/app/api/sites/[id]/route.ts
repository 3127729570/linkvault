export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { siteSchema } from "@/lib/validations";
import { apiResponse, apiError } from "@/lib/utils";
import type { SiteWithCategory } from "@/types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const site = await prisma.site.findUnique({
      where: { id: params.id },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!site) {
      return apiError("Site not found", "NOT_FOUND", 404);
    }

    let isFavorited = false;
    if (session?.user?.id) {
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_siteId: {
            userId: session.user.id,
            siteId: params.id,
          },
        },
      });
      isFavorited = !!favorite;
    }

    const result: SiteWithCategory = {
      ...site,
      isFavorited,
    };

    return apiResponse(result);
  } catch (error) {
    console.error("Get site error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return apiError("Unauthorized", "UNAUTHORIZED", 401);
    }
    if (session.user.role !== "ADMIN") {
      return apiError("Forbidden", "FORBIDDEN", 403);
    }

    const body = await request.json();
    const { isApproved, ...rest } = body;
    const parsed = siteSchema.partial().safeParse(rest);

    if (!parsed.success) {
      return apiError(
        parsed.error.issues.map((e) => e.message).join(", "),
        "VALIDATION_ERROR",
        400
      );
    }

    const existingSite = await prisma.site.findUnique({
      where: { id: params.id },
    });

    if (!existingSite) {
      return apiError("Site not found", "NOT_FOUND", 404);
    }

    if (parsed.data.url && parsed.data.url !== existingSite.url) {
      const duplicate = await prisma.site.findUnique({
        where: { url: parsed.data.url },
      });
      if (duplicate && duplicate.id !== params.id) {
        return apiError("URL already exists", "URL_EXISTS", 409);
      }
    }

    const updateData: Record<string, any> = {};

    if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
    if (parsed.data.url !== undefined) updateData.url = parsed.data.url;
    if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
    if (parsed.data.categoryId !== undefined) updateData.categoryId = parsed.data.categoryId;
    if (parsed.data.tags !== undefined) updateData.tags = parsed.data.tags;
    if (parsed.data.logo !== undefined) updateData.logo = parsed.data.logo;
    if (isApproved !== undefined) updateData.isApproved = isApproved;

    const updated = await prisma.site.update({
      where: { id: params.id },
      data: updateData,
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    return apiResponse(updated);
  } catch (error: any) {
    if (error?.code === "P2002") {
      return apiError("URL already exists", "URL_EXISTS", 409);
    }
    console.error("Update site error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return apiError("Unauthorized", "UNAUTHORIZED", 401);
    }
    if (session.user.role !== "ADMIN") {
      return apiError("Forbidden", "FORBIDDEN", 403);
    }

    const existingSite = await prisma.site.findUnique({
      where: { id: params.id },
    });

    if (!existingSite) {
      return apiError("Site not found", "NOT_FOUND", 404);
    }

    await prisma.site.delete({
      where: { id: params.id },
    });

    return apiResponse({ success: true });
  } catch (error) {
    console.error("Delete site error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}