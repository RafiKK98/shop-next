import { pgTable, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const addresses = pgTable(
  "addresses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    label: text("label"),
    fullName: text("full_name"),
    phone: text("phone"),
    street: text("street").notNull(),
    addressLine2: text("address_line_2"),
    city: text("city").notNull(),
    state: text("state"),
    postalCode: text("postal_code"),
    country: text("country").notNull(),
    isDefault: boolean("is_default").default(false),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("addresses_user_id_idx").on(table.userId),
  }),
);
