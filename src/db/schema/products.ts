import { pgTable, uuid, text, timestamp, numeric, integer, boolean, index, jsonb } from "drizzle-orm/pg-core";
import { categories } from "./categories";

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").unique().notNull(),
    description: text("description"),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    brand: text("brand"),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    discount: numeric("discount", { precision: 5, scale: 2 }).default("0"),
    stock: integer("stock").default(0),
    featured: boolean("featured").default(false),
    features: text("features").array(),
    specifications: jsonb("specifications").$type<Record<string, string>>(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    categoryIdIdx: index("products_category_id_idx").on(table.categoryId),
    featuredIdx: index("products_featured_idx").on(table.featured),
    createdAtIdx: index("products_created_at_idx").on(table.createdAt),
  }),
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    alt: text("alt"),
    order: integer("order").default(0),
  },
  (table) => ({
    productIdIdx: index("product_images_product_id_idx").on(table.productId),
  }),
);
