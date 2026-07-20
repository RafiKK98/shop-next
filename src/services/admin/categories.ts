import "server-only";

import { db } from "@/db";
import { categories, products } from "@/db/schema";
import type { CategoryFormValues } from "@/lib/validations/category";
import { and, asc, count, desc, eq, or, sql } from "drizzle-orm";
import { cache } from "react";

export interface CategoryListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  featured: boolean;
  active: boolean;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoriesResponse {
  items: CategoryListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function logDbError(err: unknown, context: string): never {
  const e = err as Record<string, unknown> & {
    code?: string;
    message?: string;
    detail?: string;
    constraint?: string;
    table?: string;
    column?: string;
  };

  console.error(`[DB ERROR] ${context}`);
  console.error(`  SQLSTATE: ${e.code ?? "N/A"}`);
  console.error(`  PostgreSQL message: ${e.message ?? "N/A"}`);
  console.error(`  Detail: ${e.detail ?? "N/A"}`);
  console.error(`  Constraint: ${e.constraint ?? "N/A"}`);
  console.error(`  Table: ${e.table ?? "N/A"}`);
  console.error(`  Column: ${e.column ?? "N/A"}`);

  if (process.env.NODE_ENV === "development")
    console.error("  Full error:", err);

  throw err;
}

const productCountSubquery = sql<number>`
  (SELECT count(*)::int FROM ${products} WHERE ${eq(products.categoryId, categories.id)})
`;

const categoryListColumns = {
  id: categories.id,
  name: categories.name,
  slug: categories.slug,
  description: categories.description,
  image: categories.image,
  featured: categories.featured,
  active: categories.active,
  productCount: productCountSubquery,
  createdAt: categories.createdAt,
  updatedAt: categories.updatedAt,
};

export async function getAdminCategories(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}): Promise<CategoriesResponse> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
  const search = params.search?.trim() ?? "";
  const sort = params.sort ?? "createdAt";
  const order = params.order ?? "desc";

  const whereConditions = [];
  if (search)
    whereConditions.push(
      or(
        sql`${categories.name}::text ilike ${`%${search}%`}`,
        sql`${categories.slug}::text ilike ${`%${search}%`}`,
      ),
    );

  const where =
    whereConditions.length > 0 ? and(...whereConditions) : undefined;

  const sortColumn =
    sort === "name"
      ? categories.name
      : sort === "featured"
        ? categories.featured
        : sort === "active"
          ? categories.active
          : sort === "productCount"
            ? productCountSubquery
            : categories.createdAt;

  const orderFn = order === "asc" ? asc : desc;

  try {
    const [totalResult, rows] = await Promise.all([
      db.select({ value: count() }).from(categories).where(where),
      db
        .select(categoryListColumns)
        .from(categories)
        .where(where)
        .orderBy(orderFn(sortColumn))
        .offset((page - 1) * pageSize)
        .limit(pageSize),
    ]);

    const total = totalResult[0]?.value ?? 0;

    return {
      items: rows,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (err) {
    logDbError(err, "getAdminCategories");
  }
}

export const getAdminCategoryById = cache(async function getAdminCategoryById(
  id: string,
): Promise<CategoryListItem | null> {
  try {
    const row = await db
      .select(categoryListColumns)
      .from(categories)
      .where(eq(categories.id, id))
      .then((r) => r[0] ?? null);

    return row;
  } catch (err) {
    logDbError(err, "getAdminCategoryById");
  }
});

export async function getCategoryProductCount(id: string): Promise<number> {
  const result = await db
    .select({ value: count() })
    .from(products)
    .where(eq(products.categoryId, id))
    .then((r) => r[0]?.value ?? 0);
  return result;
}

export async function createCategoryDb(
  data: CategoryFormValues,
): Promise<void> {
  const existing = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, data.slug))
    .then((r) => r[0] ?? null);

  if (existing)
    throw new Error(`A category with slug "${data.slug}" already exists`);

  await db.insert(categories).values({
    name: data.name,
    slug: data.slug,
    description: data.description || null,
    image: data.image || null,
    featured: data.featured ?? false,
    active: data.active ?? true,
  });
}

export async function updateCategoryDb(
  id: string,
  data: CategoryFormValues,
): Promise<void> {
  const existing = await db
    .select({ id: categories.id })
    .from(categories)
    .where(and(eq(categories.slug, data.slug), sql`${categories.id} != ${id}`))
    .then((r) => r[0] ?? null);

  if (existing)
    throw new Error(`A category with slug "${data.slug}" already exists`);

  const result = await db
    .update(categories)
    .set({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      image: data.image || null,
      featured: data.featured ?? false,
      active: data.active ?? true,
      updatedAt: new Date(),
    })
    .where(eq(categories.id, id))
    .returning({ id: categories.id });

  if (result.length === 0) throw new Error("Category not found");
}

export async function deleteCategoryDb(
  id: string,
): Promise<{ productCount: number }> {
  const cat = await db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .where(eq(categories.id, id))
    .then((r) => r[0] ?? null);

  if (!cat) throw new Error("Category not found");

  const productCount = await getCategoryProductCount(id);

  if (productCount > 0)
    throw new Error(
      `Cannot delete "${cat.name}" because ${productCount} product(s) still belong to this category. Reassign or delete those products first.`,
    );

  await db.delete(categories).where(eq(categories.id, id));
  return { productCount: 0 };
}

export async function getCategoryImageUrl(id: string): Promise<string | null> {
  const row = await db
    .select({ image: categories.image })
    .from(categories)
    .where(eq(categories.id, id))
    .then((r) => r[0] ?? null);
  return row?.image ?? null;
}
