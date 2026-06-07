export const dynamic = 'force-dynamic';

import { getActiveAdsByPosition } from "@/lib/ad-service";
import { apiResponse, apiError } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position");

    if (!position) {
      return apiError("Position query parameter is required", "MISSING_PARAM", 400);
    }

    const validPositions = ["SIDEBAR", "TOP_BANNER", "IN_CONTENT", "FOOTER"];
    if (!validPositions.includes(position.toUpperCase())) {
      return apiError("Invalid position", "INVALID_PARAM", 400);
    }

    const ads = await getActiveAdsByPosition(position.toUpperCase());

    return apiResponse(ads);
  } catch (error) {
    console.error("Get ads error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}