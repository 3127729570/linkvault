// Ad service for LinkVault - handles ad slot queries

import { prisma } from "@/lib/prisma";
import type { AdSlotWithDates } from "@/types";

export async function getActiveAdsByPosition(
  position: string
): Promise<AdSlotWithDates[]> {
  const now = new Date();

  const ads = await prisma.adSlot.findMany({
    where: {
      position: position as any,
      isActive: true,
      type: "CUSTOM",
      OR: [
        { startDate: null, endDate: null },
        { startDate: { lte: now }, endDate: null },
        { startDate: null, endDate: { gte: now } },
        { startDate: { lte: now }, endDate: { gte: now } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return ads.map((ad) => ({
    ...ad,
    startDate: ad.startDate?.toISOString() ?? null,
    endDate: ad.endDate?.toISOString() ?? null,
    createdAt: ad.createdAt.toISOString(),
    updatedAt: ad.updatedAt.toISOString(),
  }));
}