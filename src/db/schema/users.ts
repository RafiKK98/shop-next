import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { userRoleEnum, userStatusEnum } from "./enums";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  password: text("password"),
  image: text("image"),
  phone: text("phone"),
  role: userRoleEnum("role").default("customer").notNull(),
  status: userStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
