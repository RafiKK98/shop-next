import "server-only";

import { db } from "@/db";
import {
  cartItems,
  carts,
  coupons,
  couponUsages,
  orderItems,
  orders,
  products,
} from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { and, eq, sql } from "drizzle-orm";

interface OrderForCheckout {
  id: string;
  userId: string;
  total: string;
  couponId: string | null;
  couponCode: string | null;
  discountAmount: string | null;
  subtotal: number;
  shipping: number;
  tax: number;
  items: {
    productName: string;
    productImage: string | null;
    price: string;
    quantity: number;
  }[];
}

export async function createCheckoutSession(
  order: OrderForCheckout,
  customerEmail: string | null,
): Promise<{ url: string; sessionId: string }> {
  const { items, total, shipping, tax } = order;
  const orderNumber = order.id.slice(0, 8).toUpperCase();

  interface StripeLineItem {
    price_data: {
      currency: string;
      product_data: { name: string; images?: string[] };
      unit_amount: number;
    };
    quantity: number;
  }

  const lineItems: StripeLineItem[] = items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.productName,
        images: item.productImage ? [item.productImage] : [],
      },
      unit_amount: Math.round(parseFloat(item.price) * 100),
    },
    quantity: item.quantity,
  }));

  if (shipping > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Shipping" },
        unit_amount: Math.round(shipping * 100),
      },
      quantity: 1,
    });
  }

  if (tax > 0) {
    const taxCents = Math.round(tax * 100);
    const itemsSubtotal = lineItems.reduce(
      (sum, li) => sum + li.price_data.unit_amount * li.quantity,
      0,
    );

    if (itemsSubtotal + taxCents !== Math.round(parseFloat(total) * 100)) {
      const diff = Math.round(parseFloat(total) * 100) - itemsSubtotal;
      if (diff !== 0) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: { name: "Tax" },
            unit_amount: diff,
          },
          quantity: 1,
        });
      }
    } else {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Tax" },
          unit_amount: taxCents,
        },
        quantity: 1,
      });
    }
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: customerEmail ?? undefined,
    line_items: lineItems,
    metadata: { orderId: order.id, orderNumber },
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout/cancel?orderId=${order.id}`,
  });

  if (!session.url) {
    throw new Error("Stripe session URL is missing");
  }

  return { url: session.url, sessionId: session.id };
}

export async function handleCheckoutSessionCompleted(session: {
  id: string;
  metadata: Record<string, string> | null;
  payment_intent: string | { id: string } | null;
}): Promise<void> {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    console.warn("[webhook] Missing orderId in session metadata");
    return;
  }

  const order = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .then((r) => r[0] ?? null);

  if (!order) {
    console.warn(`[webhook] Order ${orderId} not found`);
    return;
  }

  if (order.stripePaymentIntentId) {
    console.info(`[webhook] Order ${orderId} already processed, skipping`);
    return;
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  await db.transaction(async (tx) => {
    await tx
      .update(orders)
      .set({
        status: "paid",
        paymentStatus: "completed",
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: session.payment_intent
          ? typeof session.payment_intent === "string"
            ? session.payment_intent
            : (session.payment_intent as { id: string }).id
          : null,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id));

    for (const item of items) {
      const updateRes = await tx
        .update(products)
        .set({
          stock: sql`${products.stock} - ${item.quantity}`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(products.id, item.productId),
            sql`${products.stock} >= ${item.quantity}`,
          ),
        );

      if (!updateRes.rowCount || updateRes.rowCount === 0) {
        console.error(
          `[webhook] Insufficient stock for product ${item.productId} (order ${orderId})`,
        );
        tx.rollback();
        return;
      }
    }

    if (order.couponId) {
      await tx
        .update(coupons)
        .set({
          currentUsage: sql`${coupons.currentUsage} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(coupons.id, order.couponId));

      await tx.insert(couponUsages).values({
        couponId: order.couponId,
        userId: order.userId,
        orderId: order.id,
      });
    }

    const cart = await tx
      .select()
      .from(carts)
      .where(eq(carts.userId, order.userId))
      .then((r) => r[0] ?? null);

    if (cart) {
      await tx.delete(cartItems).where(eq(cartItems.cartId, cart.id));
    }
  });
}
