export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiError, apiResponse } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", "UNAUTHORIZED", 401);
    if (session.user.role !== "ADMIN") return apiError("Forbidden", "FORBIDDEN", 403);

    const user = await prisma.user.findUnique({ where: { id: params.id } });
    if (!user) return apiError("Not found", "NOT_FOUND", 404);
    if (user.id === session.user.id) return apiError("Cannot modify yourself", "FORBIDDEN", 403);

    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    const updated = await prisma.user.update({
      where: { id: params.id },
      data: { role: newRole },
      select: { id: true, name: true, email: true, role: true, image: true, createdAt: true },
    });

    return apiResponse(updated);
  } catch {
    return apiError("Internal error", "INTERNAL", 500);
  }
}