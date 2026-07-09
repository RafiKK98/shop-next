import { pgTable, uuid, text, integer, timestamp, numeric, boolean, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { orders } from "./orders";
import { couponTypeEnum } from "./enums";

export const coupons = pgTable(
  "coupons",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").unique().notNull(),
    type: couponTypeEnum("type").notNull(),
    value: numeric("value", { precision: 10, scale: 2 }).notNull(),
    description: text("description"),
    minPurchase: numeric("min_purchase", { precision: 10, scale: 2 }),
    maxDiscount: numeric("max_discount", { precision: 10, scale: 2 }),
    maxUsage: integer("max_usage"),
    currentUsage: integer("current_usage").default(0),
    isActive: boolean("is_active").default(true),
    startDate: timestamp("start_date", { mode: "date" }),
    expiresAt: timestamp("expires_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    codeIdx: index("coupons_code_idx").on(table.code),
  }),
);

export const couponUsages = pgTable(
  "coupon_usages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    couponId: uuid("coupon_id")
      .notNull()
      .references(() => coupons.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    orderId: uuid("order_id").references(() => orders.id, {
      onDelete: "set null",
    }),
    usedAt: timestamp("used_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    couponIdIdx: index("coupon_usages_coupon_id_idx").on(table.couponId),
    userIdIdx: index("coupon_usages_user_id_idx").on(table.userId),
  }),
);
