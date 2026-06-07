// Search service for LinkVault

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type SearchParams = {
  query?: string;
  categorySlug?: string;
  sort?: "latest" | "popular" | "name";
  page?: number;
  limit?: number;
  approved?: boolean;
  userId?: string;
};

export async function searchSites(params: SearchParams) {
  const {
    query,
    categorySlug,
    sort = "latest",
    page = 1,
    limit = 20,
    approved = true,
    userId,
  } = params;

  const where: Prisma.SiteWhereInput = {};

  if (approved) {
    where.isApproved = true;
  }

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { tags: { hasSome: [query] } },
    ];
  }

  let orderBy: Prisma.SiteOrderByWithRelationInput;
  switch (sort) {
    case "popular":
      orderBy = { clicks: "desc" };
      break;
    case "name":
      orderBy = { title: "asc" };
      break;
    case "latest":
    default:
      orderBy = { createdAt: "desc" };
  }

  const [sites, total, favoriteIds] = await Promise.all([
    prisma.site.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        submitter: { select: { id: true, name: true } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.site.count({ where }),
    userId
      ? prisma.favorite.findMany({
          where: { userId },
          select: { siteId: true },
        })
      : Promise.resolve([]),
  ]);

  // Mark sites as favorited if user has favorited them
  const favSet = new Set(favoriteIds.map((f) => f.siteId));
  const sitesWithFav = sites.map((site) => ({
    ...site,
    isFavorited: favSet.has(site.id),
  }));

  return { sites: sitesWithFav, total, page, limit };
}