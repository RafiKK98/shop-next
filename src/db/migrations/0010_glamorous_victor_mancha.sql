ALTER TABLE "sessions" DROP CONSTRAINT "sessions_session_token_unique";--> statement-breakpoint
ALTER TABLE "sessions" ADD PRIMARY KEY ("session_token");--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "stripe_checkout_session_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "stripe_payment_intent_id" text;--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "id";