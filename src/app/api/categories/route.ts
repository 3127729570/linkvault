export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations";
import { apiResponse, apiError } from "@/lib/utils";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: {
            sites: {
              where: { isApproved: true },
            },
          },
        },
      },
    });

    return apiResponse(categories);
  } catch (error) {
    console.error("Get categories error:", error);
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
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return apiError(
        parsed.error.issues.map((e) => e.message).join(", "),
        "VALIDATION_ERROR",
        400
      );
    }

    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        icon: parsed.data.icon,
        order: parsed.data.order ?? 0,
      },
    });

    return apiResponse(category, 201);
  } catch (error: any) {
    if (error?.code === "P2002") {
      const target = error.meta?.target as string[];
      if (target?.includes("name")) {
        return apiError("Category name already exists", "NAME_EXISTS", 409);
      }
      if (target?.includes("slug")) {
        return apiError("Category slug already exists", "SLUG_EXISTS", 409);
      }
      return apiError("Category already exists", "ALREADY_EXISTS", 409);
    }
    console.error("Create category error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}