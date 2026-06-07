// Zod validation schemas for LinkVault

import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const siteSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  url: z.string().url("Invalid URL. Must start with http:// or https://"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description too long"),
  categoryId: z.string().min(1, "Category is required"),
  tags: z.array(z.string().trim()).default([]),
  logo: z.string().url().optional().or(z.literal("")),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  icon: z.string().optional(),
  order: z.number().int().optional(),
});

export const adSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  position: z.enum(["SIDEBAR", "TOP_BANNER", "IN_CONTENT", "FOOTER"]),
  type: z.enum(["GOOGLE_AD", "CUSTOM"]),
  customImageUrl: z.string().url().optional().or(z.literal("")),
  customLink: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().optional().default(true),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
}).refine(
  (data) => {
    if (data.type === "CUSTOM") {
      return !!data.customImageUrl && !!data.customLink;
    }
    return true;
  },
  {
    message: "Custom ads require image URL and link",
    path: ["customImageUrl"],
  }
);

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.string().optional(),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SiteInput = z.infer<typeof siteSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type AdInput = z.infer<typeof adSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;