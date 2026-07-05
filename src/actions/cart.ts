"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { carts, cartItems, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getOrCreateCart } from "@/lib/cart";

export async function addToCart(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    const callbackUrl = (formData.get("callbackUrl") as string) || "/";
    return { redirect: `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` };
  }

  const slug = formData.get("slug") as string;
  const quantity = Math.max(1, parseInt(formData.get("quantity") as string) || 1);

  if (!slug) return { error: "Missing product slug" };

  const product = await db
    .select({ id: products.id, stock: products.stock })
    .from(products)
    .where(eq(products.slug, slug))
    .then((r) => r[0] ?? null);

  if (!product) return { error: "Product not found" };
  if ((product.stock ?? 0) < 1) return { error: "Product is out of stock" };

  const cart = await getOrCreateCart(session.user.id);

  const existing = await db
    .select()
    .from(cartItems)
    .where(
      and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, product.id)),
    )
    .then((r) => r[0] ?? null);

  const maxAllowed = Math.max(product.stock ?? 0, existing?.quantity ?? 0);
  const newQty = existing
    ? Math.min(existing.quantity + quantity, maxAllowed)
    : Math.min(quantity, product.stock ?? 0);

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: newQty })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({
      cartId: cart.id,
      productId: product.id,
      quantity: newQty,
    });
  }

  revalidatePath("/");
  revalidatePath("/cart");
  return { success: true };
}

export async function updateCartItemQuantity(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const itemId = formData.get("itemId") as string;
  const quantity = Math.max(1, parseInt(formData.get("quantity") as string) || 1);

  if (!itemId) return { error: "Missing item ID" };

  const cart = await db
    .select()
    .from(carts)
    .where(eq(carts.userId, session.user.id))
    .then((r) => r[0] ?? null);

  if (!cart) return { error: "Cart not found" };

  const item = await db
    .select({ id: cartItems.id, productId: cartItems.productId })
    .from(cartItems)
    .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cart.id)))
    .then((r) => r[0] ?? null);

  if (!item) return { error: "Item not found in cart" };

  const product = await db
    .select({ stock: products.stock })
    .from(products)
    .where(eq(products.id, item.productId))
    .then((r) => r[0] ?? null);

  const safeQty = product ? Math.min(quantity, product.stock ?? 0) : quantity;

  await db
    .update(cartItems)
    .set({ quantity: safeQty })
    .where(eq(cartItems.id, itemId));

  revalidatePath("/");
  revalidatePath("/cart");
  return { success: true };
}

export async function removeFromCart(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const itemId = formData.get("itemId") as string;
  if (!itemId) return { error: "Missing item ID" };

  const cart = await db
    .select()
    .from(carts)
    .where(eq(carts.userId, session.user.id))
    .then((r) => r[0] ?? null);

  if (!cart) return { error: "Cart not found" };

  await db
    .delete(cartItems)
    .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cart.id)));

  revalidatePath("/");
  revalidatePath("/cart");
  return { success: true };
}

export async function clearCart() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const cart = await db
    .select()
    .from(carts)
    .where(eq(carts.userId, session.user.id))
    .then((r) => r[0] ?? null);

  if (!cart) return { error: "Cart not found" };

  await db
    .delete(cartItems)
    .where(eq(cartItems.cartId, cart.id));

  revalidatePath("/");
  revalidatePath("/cart");
  return { success: true };
}
