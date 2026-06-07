export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations";
import { apiResponse, apiError } from "@/lib/utils";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    // Try to find by ID first, then by slug
    let category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      category = await prisma.category.findUnique({ where: { slug: id } });
    }
    if (!category) {
      return apiError("Category not found", "NOT_FOUND", 404);
    }
    return apiResponse(category);
  } catch (error) {
    console.error("Get category error:", error);
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
    const parsed = categorySchema.partial().safeParse(body);

    if (!parsed.success) {
      return apiError(
        parsed.error.issues.map((e) => e.message).join(", "),
        "VALIDATION_ERROR",
        400
      );
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
    });

    if (!existingCategory) {
      return apiError("Category not found", "NOT_FOUND", 404);
    }

    const updated = await prisma.category.update({
      where: { id: params.id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        icon: parsed.data.icon,
        order: parsed.data.order,
      },
    });

    return apiResponse(updated);
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
    console.error("Update category error:", error);
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

    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
    });

    if (!existingCategory) {
      return apiError("Category not found", "NOT_FOUND", 404);
    }

    const siteCount = await prisma.site.count({
      where: { categoryId: params.id },
    });

    if (siteCount > 0) {
      return apiError("Category has associated sites", "HAS_SITES", 409);
    }

    await prisma.category.delete({
      where: { id: params.id },
    });

    return apiResponse({ success: true });
  } catch (error) {
    console.error("Delete category error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}