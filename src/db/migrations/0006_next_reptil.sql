CREATE TYPE "public"."review_status" AS ENUM('pending', 'approved', 'rejected', 'hidden');--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "title" text;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "status" "review_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
CREATE INDEX "reviews_status_idx" ON "reviews" USING btree ("status");