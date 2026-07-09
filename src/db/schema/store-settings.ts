import { pgTable, text, boolean, numeric, timestamp, index } from "drizzle-orm/pg-core";

export const storeSettings = pgTable(
  "store_settings",
  {
    key: text("key").primaryKey(),
    value: text("value").notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    keyIdx: index("store_settings_key_idx").on(table.key),
  }),
);