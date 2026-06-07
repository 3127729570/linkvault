// Type definitions for LinkVault

import type { Role } from "@prisma/client";

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
};

export type SiteWithCategory = {
  id: string;
  title: string;
  url: string;
  description: string;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  tags: string[];
  logo: string | null;
  screenshot: string | null;
  clicks: number;
  isApproved: boolean;
  submitterId: string | null;
  submitter?: { id: string; name: string } | null;
  createdAt: Date;
  updatedAt: Date;
  isFavorited?: boolean;
};

export type CategoryWithCount = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  order: number;
  _count?: { sites: number };
};

export type AdSlotWithDates = {
  id: string;
  name: string;
  description: string | null;
  position: string;
  type: string;
  customImageUrl: string | null;
  customLink: string | null;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DashboardStats = {
  totalSites: number;
  pendingSites: number;
  totalUsers: number;
  totalClicks: number;
};

export type PaginatedResponse<T> = {
  success: true;
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export type ApiResponse<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: string;
  code: string;
};