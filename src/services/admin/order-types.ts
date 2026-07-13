import { orderStatusEnum, paymentStatusEnum } from "@/db/schema";

// ── Types ───────────────────────────────────────────────────────────────

export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];
export type PaymentStatus = (typeof paymentStatusEnum.enumValues)[number];

export interface OrderListItem {
  id: string;
  customerName: string | null;
  customerEmail: string | null;
  total: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  itemCount: number;
  createdAt: Date;
}

export interface OrdersResponse {
  items: OrderListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OrderStats {
  pending: number;
  processing: number;
  revenue: number;
  ordersToday: number;
}

export interface OrderItemDetail {
  id: string;
  productId: string;
  productName: string;
  productImage: string | null;
  quantity: number;
  price: string;
}

export interface OrderDetail {
  id: string;
  total: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  customer: {
    name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  shippingAddress: {
    fullName: string | null;
    phone: string | null;
    street: string;
    addressLine2: string | null;
    city: string;
    state: string | null;
    postalCode: string | null;
    country: string;
  } | null;
  items: OrderItemDetail[];
  subtotal: number;
}

// ── Status transition rules ─────────────────────────────────────────────

export const VALID_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "processing", "cancelled"],
  paid: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const VALID_PAYMENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  pending: ["completed", "failed"],
  completed: ["refunded"],
  failed: ["pending"],
  refunded: [],
};

// ── Display helpers ─────────────────────────────────────────────────────

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: "Pending",
  completed: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};
