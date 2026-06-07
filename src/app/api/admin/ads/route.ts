export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adSchema } from "@/lib/validations";
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

    const adSlots = await prisma.adSlot.findMany({
      orderBy: { createdAt: "desc" },
    });

    const ads = adSlots.map((ad: { startDate: Date | null; endDate: Date | null; createdAt: Date; updatedAt: Date }) => ({
      ...ad,
      startDate: ad.startDate?.toISOString() ?? null,
      endDate: ad.endDate?.toISOString() ?? null,
      createdAt: ad.createdAt.toISOString(),
      updatedAt: ad.updatedAt.toISOString(),
    }));

    return apiResponse(ads);
  } catch (error) {
    console.error("Get ad slots error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return apiError("Unauthorized", "UNAUTHORIZED", 401);
    }
    if (session.user.role !== "ADMIN") {
      return apiError("Forbidden", "FORBIDDEN", 403);
    }

    const body = await request.json();
    const parsed = adSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(
        parsed.error.issues.map((e) => e.message).join(", "),
        "VALIDATION_ERROR",
        400
      );
    }

    const adSlot = await prisma.adSlot.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        position: parsed.data.position,
        type: parsed.data.type,
        customImageUrl: parsed.data.customImageUrl || null,
        customLink: parsed.data.customLink || null,
        isActive: parsed.data.isActive,
        startDate: parsed.data.startDate || null,
        endDate: parsed.data.endDate || null,
      },
    });

    const result = {
      ...adSlot,
      startDate: adSlot.startDate?.toISOString() ?? null,
      endDate: adSlot.endDate?.toISOString() ?? null,
      createdAt: adSlot.createdAt.toISOString(),
      updatedAt: adSlot.updatedAt.toISOString(),
    };

    return apiResponse(result, 201);
  } catch (error) {
    console.error("Create ad slot error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}