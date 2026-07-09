CREATE TABLE IF NOT EXISTS "store_settings" (
  "key" text PRIMARY KEY NOT NULL,
  "value" text NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX "store_settings_key_idx" ON "store_settings" USING btree ("key");