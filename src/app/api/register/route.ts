export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { apiResponse, apiError } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(
        parsed.error.issues.map((e) => e.message).join(", "),
        "VALIDATION_ERROR",
        400
      );
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return apiError("Email already registered", "EMAIL_EXISTS", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) =>
      e.trim().toLowerCase()
    ) ?? [];

    const role = adminEmails.includes(email.toLowerCase()) ? "ADMIN" : "USER";

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return apiResponse(
      { message: "Registration successful" },
      201
    );
  } catch (error: any) {
    if (error?.code === "P2002") {
      return apiError("Email already registered", "EMAIL_EXISTS", 409);
    }
    console.error("Registration error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}