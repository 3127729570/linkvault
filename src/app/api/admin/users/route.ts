export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiError, apiResponse } from "@/lib/utils";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", "UNAUTHORIZED", 401);
    if (session.user.role !== "ADMIN") return apiError("Forbidden", "FORBIDDEN", 403);

    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, image: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    return apiResponse(users);
  } catch {
    return apiError("Internal error", "INTERNAL", 500);
  }
}