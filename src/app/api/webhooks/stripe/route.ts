import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { handleCheckoutSessionCompleted } from "@/services/payment";

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const body = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? "",
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("[webhook] Signature verification failed:", message);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as {
        id: string;
        metadata: Record<string, string> | null;
        payment_intent: string | null;
      };
      await handleCheckoutSessionCompleted(session);
    }
  } catch (err) {
    console.error("[webhook] Handler error:", err);
    return new Response("Internal server error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
