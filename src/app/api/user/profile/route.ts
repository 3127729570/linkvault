export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validations";
import { apiResponse, apiError } from "@/lib/utils";

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return apiError("Unauthorized", "UNAUTHORIZED", 401);
    }

    const body = await request.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("Validation failed", "VALIDATION_ERROR", 400);
    }

    const { name, image } = parsed.data;

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        image: image || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });

    return apiResponse(updated);
  } catch (error) {
    console.error("Update profile error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}