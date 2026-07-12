"use server";

import { db } from "@/db";
import { cartItems, products, wishlistItems } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getOrCreateCart } from "@/lib/cart";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    const callbackUrl = (formData.get("callbackUrl") as string) || "/";
    return {
      redirect: `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`,
    };
  }

  const slug = formData.get("slug") as string;
  if (!slug) return { error: "Missing product slug" };

  const product = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.slug, slug))
    .then((r) => r[0] ?? null);

  if (!product) return { error: "Product not found" };

  const existing = await db
    .select()
    .from(wishlistItems)
    .where(
      and(
        eq(wishlistItems.userId, session.user.id),
        eq(wishlistItems.productId, product.id),
      ),
    )
    .then((r) => r[0] ?? null);

  if (existing) {
    await db.delete(wishlistItems).where(eq(wishlistItems.id, existing.id));
  } else {
    await db.insert(wishlistItems).values({
      userId: session.user.id,
      productId: product.id,
    });
  }

  revalidatePath("/");
  revalidatePath("/wishlist");
  return { success: true, isWishlisted: !existing };
}

export async function removeFromWishlist(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const itemId = formData.get("itemId") as string;
  if (!itemId) return { error: "Missing item ID" };

  await db
    .delete(wishlistItems)
    .where(
      and(
        eq(wishlistItems.id, itemId),
        eq(wishlistItems.userId, session.user.id),
      ),
    );

  revalidatePath("/");
  revalidatePath("/wishlist");
  return { success: true };
}

export async function moveWishlistToCart(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const wishlistItemId = formData.get("wishlistItemId") as string;
  if (!wishlistItemId) return { error: "Missing wishlist item ID" };

  const item = await db
    .select({
      id: wishlistItems.id,
      productId: wishlistItems.productId,
    })
    .from(wishlistItems)
    .where(
      and(
        eq(wishlistItems.id, wishlistItemId),
        eq(wishlistItems.userId, session.user.id),
      ),
    )
    .then((r) => r[0] ?? null);

  if (!item) return { error: "Wishlist item not found" };

  const product = await db
    .select({ id: products.id, stock: products.stock, slug: products.slug })
    .from(products)
    .where(eq(products.id, item.productId))
    .then((r) => r[0] ?? null);

  if (!product) return { error: "Product not found" };
  if ((product.stock ?? 0) < 1) return { error: "Product is out of stock" };

  const cart = await getOrCreateCart(session.user.id);

  const existingCartItem = await db
    .select()
    .from(cartItems)
    .where(
      and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, product.id)),
    )
    .then((r) => r[0] ?? null);

  const maxAllowed = Math.max(
    product.stock ?? 0,
    existingCartItem?.quantity ?? 0,
  );
  const newQty = existingCartItem
    ? Math.min(existingCartItem.quantity + 1, maxAllowed)
    : 1;

  if (existingCartItem) {
    await db
      .update(cartItems)
      .set({ quantity: newQty })
      .where(eq(cartItems.id, existingCartItem.id));
  } else {
    await db.insert(cartItems).values({
      cartId: cart.id,
      productId: product.id,
      quantity: newQty,
    });
  }

  await db.delete(wishlistItems).where(eq(wishlistItems.id, wishlistItemId));

  revalidatePath("/");
  revalidatePath("/cart");
  revalidatePath("/wishlist");
  return { success: true, removedFromWishlist: true };
}
