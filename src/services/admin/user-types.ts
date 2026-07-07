import { userRoleEnum, userStatusEnum } from "@/db/schema";

// ── Types ───────────────────────────────────────────────────────────────

export type UserRole = (typeof userRoleEnum.enumValues)[number];
export type UserStatus = (typeof userStatusEnum.enumValues)[number];

export interface UserListItem {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: Date | null;
  orderCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsersResponse {
  items: UserListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UserDetail {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
  orderCount: number;
  totalSpent: number;
  wishlistCount: number;
  defaultAddress: {
    fullName: string | null;
    street: string;
    city: string;
    state: string | null;
    postalCode: string | null;
    country: string;
  } | null;
}

export interface RecentOrder {
  id: string;
  total: string;
  status: string;
  createdAt: Date;
  itemCount: number;
}

export interface RecentWishlistItem {
  id: string;
  productId: string;
  createdAt: Date;
}

// ── Display helpers ─────────────────────────────────────────────────────

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  customer: "Customer",
  admin: "Admin",
};

export const USER_STATUS_LABEL: Record<UserStatus, string> = {
  active: "Active",
  suspended: "Suspended",
  disabled: "Disabled",
};
