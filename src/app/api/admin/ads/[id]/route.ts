export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adSchema } from "@/lib/validations";
import { apiResponse, apiError } from "@/lib/utils";

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
    const parsed = adSchema.partial().safeParse(body);

    if (!parsed.success) {
      return apiError(
        parsed.error.issues.map((e) => e.message).join(", "),
        "VALIDATION_ERROR",
        400
      );
    }

    const existingAd = await prisma.adSlot.findUnique({
      where: { id: params.id },
    });

    if (!existingAd) {
      return apiError("Ad slot not found", "NOT_FOUND", 404);
    }

    const updateData: Record<string, any> = {};
    if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
    if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
    if (parsed.data.position !== undefined) updateData.position = parsed.data.position;
    if (parsed.data.type !== undefined) updateData.type = parsed.data.type;
    if (parsed.data.customImageUrl !== undefined) updateData.customImageUrl = parsed.data.customImageUrl || null;
    if (parsed.data.customLink !== undefined) updateData.customLink = parsed.data.customLink || null;
    if (parsed.data.isActive !== undefined) updateData.isActive = parsed.data.isActive;
    if (parsed.data.startDate !== undefined) updateData.startDate = parsed.data.startDate || null;
    if (parsed.data.endDate !== undefined) updateData.endDate = parsed.data.endDate || null;

    const updated = await prisma.adSlot.update({
      where: { id: params.id },
      data: updateData,
    });

    const result = {
      ...updated,
      startDate: updated.startDate?.toISOString() ?? null,
      endDate: updated.endDate?.toISOString() ?? null,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };

    return apiResponse(result);
  } catch (error) {
    console.error("Update ad slot error:", error);
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

    const existingAd = await prisma.adSlot.findUnique({
      where: { id: params.id },
    });

    if (!existingAd) {
      return apiError("Ad slot not found", "NOT_FOUND", 404);
    }

    await prisma.adSlot.delete({
      where: { id: params.id },
    });

    return apiResponse({ success: true });
  } catch (error) {
    console.error("Delete ad slot error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}