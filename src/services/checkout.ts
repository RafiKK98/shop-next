import { db } from "@/db";
import { orders, orderItems, cartItems, carts, products, addresses } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { productImages } from "@/db/schema";

export interface CreateOrderResult {
  orderId: string;
}

export interface CreateOrderError {
  error: string;
}

function parseDbError(err: unknown): string {
  const e = err as Record<string, unknown> & { message?: string; code?: string; constraint?: string; column?: string; table?: string; detail?: string };

  if (e.code) {
    const parts = [`SQLSTATE ${e.code}`];
    if (e.message) parts.push(e.message.replace(/\n/g, " "));
    if (e.constraint) parts.push(`constraint: ${e.constraint}`);
    if (e.column) parts.push(`column: ${e.column}`);
    if (e.table) parts.push(`table: ${e.table}`);
    if (e.detail) parts.push(`detail: ${e.detail}`);
    return parts.join(" | ");
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "An unexpected database error occurred";
}

interface ProductForOrder {
  id: string;
  title: string;
  price: string;
  discount: string | null;
  stock: number | null;
  image: string | null;
}

async function fetchProduct(productId: string): Promise<ProductForOrder | null> {
  const row = await db
    .select({
      id: products.id,
      title: products.title,
      price: products.price,
      discount: products.discount,
      stock: products.stock,
      image: sql<string | null>`
        (SELECT ${productImages.imageUrl}
         FROM ${productImages}
         WHERE ${productImages.productId} = ${products.id}
         ORDER BY ${productImages.order}
         LIMIT 1)
      `,
    })
    .from(products)
    .where(eq(products.id, productId))
    .then((r) => r[0] ?? null);

  return row;
}

function computeUnitPrice(product: ProductForOrder): number {
  const price = parseFloat(product.price);
  const discount = parseFloat(product.discount || "0");
  return discount > 0 ? price * (1 - discount / 100) : price;
}

async function getFirstProductImage(productId: string): Promise<string | null> {
  return db
    .select({ imageUrl: productImages.imageUrl })
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(productImages.order)
    .limit(1)
    .then((r) => r[0]?.imageUrl ?? null);
}

function computeOrderTotals(
  items: { product: ProductForOrder; quantity: number }[],
) {
  const subtotal = items.reduce((sum, item) => {
    return sum + computeUnitPrice(item.product) * item.quantity;
  }, 0);

  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
}

export async function createOrder(
  userId: string,
  addressId: string,
): Promise<CreateOrderResult | CreateOrderError> {
  // 1. Validate the address
  const address = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
    .then((r) => r[0] ?? null);

  if (!address) {
    return { error: "Invalid shipping address" };
  }

  // 2. Load the latest cart from the database
  const cart = await db
    .select()
    .from(carts)
    .where(eq(carts.userId, userId))
    .then((r) => r[0] ?? null);

  if (!cart) {
    return { error: "Your cart is empty" };
  }

  // 3. Load cart items
  const items = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.cartId, cart.id));

  if (items.length === 0) {
    return { error: "Your cart is empty" };
  }

  // 4. Validate every product
  const validatedItems: { cartItemId: string; product: ProductForOrder; quantity: number }[] = [];

  for (const item of items) {
    const product = await fetchProduct(item.productId);

    if (!product) {
      await db
        .delete(cartItems)
        .where(eq(cartItems.id, item.id));
      return { error: "Some items in your cart are no longer available" };
    }

    const stock = product.stock ?? 0;
    if (stock < 1) {
      return { error: `"${product.title}" is no longer in stock` };
    }

    if (item.quantity > stock) {
      return {
        error: `Only ${stock} of "${product.title}" are available (you requested ${item.quantity})`,
      };
    }

    validatedItems.push({ cartItemId: item.id, product, quantity: item.quantity });
  }

  // 5. Recalculate all prices server-side
  const totals = computeOrderTotals(validatedItems);

  // 6. Execute the order in a single transaction
  let result: { orderId: string } | undefined;

  try {
    result = await db.transaction(async (tx) => {
      // Create the order
      const [order] = await tx
        .insert(orders)
        .values({
          userId,
          total: totals.total.toFixed(2),
          status: "pending",
          paymentStatus: "pending",
        })
        .returning();

      // Create order items with product snapshots
      const orderItemsData = await Promise.all(
        validatedItems.map(async (vi) => {
          const image = await getFirstProductImage(vi.product.id);
          return {
            orderId: order.id,
            productId: vi.product.id,
            quantity: vi.quantity,
            price: computeUnitPrice(vi.product).toFixed(2),
            productName: vi.product.title,
            productImage: image,
          };
        }),
      );

      await tx.insert(orderItems).values(orderItemsData);

      // Decrease inventory for purchased products
      for (const vi of validatedItems) {
        const updateRes = await tx
          .update(products)
          .set({
            stock: sql`${products.stock} - ${vi.quantity}`,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(products.id, vi.product.id),
              sql`${products.stock} >= ${vi.quantity}`,
            ),
          );

        if (!updateRes.rowCount || updateRes.rowCount === 0) {
          tx.rollback();
          return;
        }
      }

      // Remove all cart items (keep the cart)
      await tx
        .delete(cartItems)
        .where(eq(cartItems.cartId, cart.id));

      return { orderId: order.id };
    });
  } catch (err) {
    const details = parseDbError(err);
    console.error("[createOrder] transaction failed:", details, err);
    return { error: "A database error occurred while placing your order. Please try again." };
  }

  if (!result) {
    return { error: "Some items could not be fulfilled due to insufficient stock" };
  }

  return result;
}
