export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { apiResponse, apiError } from "@/lib/utils";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return apiError("Unauthorized", "UNAUTHORIZED", 401);
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return apiError("No file provided", "VALIDATION_ERROR", 400);
    }

    if (!file.type.startsWith("image/")) {
      return apiError("File must be an image", "INVALID_FILE_TYPE", 400);
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return apiError("File size must be less than 5MB", "FILE_TOO_LARGE", 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = file.name.split(".").pop() || "png";
    const filename = `${crypto.randomUUID()}.${ext}`;

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Save file to public/uploads
    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    const url = `/uploads/${filename}`;
    return apiResponse({ url }, 201);
  } catch (error) {
    console.error("Upload error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}