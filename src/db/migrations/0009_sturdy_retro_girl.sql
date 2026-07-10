CREATE TABLE "store_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "features" text[];--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "specifications" jsonb;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "coupon_id" uuid;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "coupon_code" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "discount_amount" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN "max_discount" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN "start_date" timestamp;--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX "store_settings_key_idx" ON "store_settings" USING btree ("key");--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE set null ON UPDATE no action;