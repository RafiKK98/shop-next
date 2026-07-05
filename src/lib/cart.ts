import { db } from "@/db";
import { carts, cartItems, products, productImages } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

export interface CartItemWithProduct {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    slug: string;
    price: string;
    discount: string;
    stock: number;
    image: string | null;
    imageAlt: string | null;
  };
}

function getFirstImage() {
  return sql<string | null>`
    (SELECT ${productImages.imageUrl}
     FROM ${productImages}
     WHERE ${productImages.productId} = ${products.id}
     ORDER BY ${productImages.order}
     LIMIT 1)
  `;
}

function getFirstImageAlt() {
  return sql<string | null>`
    (SELECT ${productImages.alt}
     FROM ${productImages}
     WHERE ${productImages.productId} = ${products.id}
     ORDER BY ${productImages.order}
     LIMIT 1)
  `;
}

export async function getUserCart(userId: string) {
  return db
    .select()
    .from(carts)
    .where(eq(carts.userId, userId))
    .then((rows) => rows[0] ?? null);
}

export async function getOrCreateCart(userId: string) {
  let cart = await getUserCart(userId);
  if (!cart) {
    cart = (await db.insert(carts).values({ userId }).returning())[0];
  }
  return cart;
}

export async function getCartItems(userId: string): Promise<CartItemWithProduct[]> {
  const cart = await getUserCart(userId);
  if (!cart) return [];

  const rows = await db
    .select({
      id: cartItems.id,
      cartId: cartItems.cartId,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      product: {
        id: products.id,
        title: products.title,
        slug: products.slug,
        price: products.price,
        discount: products.discount,
        stock: products.stock,
        image: getFirstImage(),
        imageAlt: getFirstImageAlt(),
      },
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cart.id))
    .orderBy(cartItems.id);

  return rows as CartItemWithProduct[];
}

export async function getCartCount(userId: string): Promise<number> {
  const cart = await getUserCart(userId);
  if (!cart) return 0;

  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(cartItems)
    .where(eq(cartItems.cartId, cart.id))
    .then((rows) => rows[0]?.count ?? 0);

  return result;
}
