export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { siteSchema } from "@/lib/validations";
import { searchSites } from "@/lib/search-service";
import { apiPaginatedResponse, apiResponse, apiError, getFaviconUrl } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("categorySlug") || undefined;
    const search = searchParams.get("search") || undefined;
    const sort = (searchParams.get("sort") as any) || "latest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const approved = searchParams.get("approved") !== "false";

    const result = await searchSites({
      query: search,
      categorySlug,
      sort,
      page,
      limit,
      approved,
      userId: session?.user?.id,
    });

    return apiPaginatedResponse(result.sites, result.total, result.page, result.limit);
  } catch (error) {
    console.error("Get sites error:", error);
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
    const parsed = siteSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(
        parsed.error.issues.map((e) => e.message).join(", "),
        "VALIDATION_ERROR",
        400
      );
    }

    const { title, url, description, categoryId, tags, logo } = parsed.data;

    const existingSite = await prisma.site.findUnique({
      where: { url },
    });

    if (existingSite) {
      return apiError("URL already submitted", "URL_EXISTS", 409);
    }

    const site = await prisma.site.create({
      data: {
        title,
        url,
        description,
        categoryId,
        tags: tags || [],
        logo: logo || getFaviconUrl(url),
        isApproved: false,
        submitterId: session.user.id,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return apiResponse(site, 201);
  } catch (error: any) {
    if (error?.code === "P2002") {
      return apiError("URL already submitted", "URL_EXISTS", 409);
    }
    console.error("Create site error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}