CREATE TABLE IF NOT EXISTS "users" (
	"wallet_address" text PRIMARY KEY NOT NULL,
	"ens_name" text,
	"ens_node" text,
	"display_name" text,
	"avatar_url" text,
	"bio" text,
	"synced_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone,
	CONSTRAINT "users_ens_name_unique" UNIQUE("ens_name"),
	CONSTRAINT "users_ens_node_unique" UNIQUE("ens_node")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_address" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "broadcast_guests" (
	"broadcast_id" uuid NOT NULL,
	"guest_wallet" text NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"left_at" timestamp with time zone,
	CONSTRAINT "broadcast_guests_broadcast_id_guest_wallet_pk" PRIMARY KEY("broadcast_id","guest_wallet")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "broadcasts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"is_live" boolean DEFAULT false NOT NULL,
	"stream_provider" text NOT NULL,
	"stream_id" text NOT NULL,
	"stream_protocol" text,
	"ingest_secret_ref" text,
	"title" text,
	"thumbnail_url" text,
	"started_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"last_heartbeat_at" timestamp with time zone,
	"viewer_peak" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" text NOT NULL,
	"ref" text NOT NULL,
	"url" text,
	"content_type" text,
	"size_bytes" bigint,
	"sha256" text,
	"uploaded_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "assets_provider_ref_unq" UNIQUE("provider","ref")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "art_pieces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"asset_id" uuid,
	"title" text,
	"description" text,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "follows" (
	"follower_wallet" text NOT NULL,
	"followee_wallet" text NOT NULL,
	"followed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "follows_follower_wallet_followee_wallet_pk" PRIMARY KEY("follower_wallet","followee_wallet")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile_drafts" (
	"user_id" text PRIMARY KEY NOT NULL,
	"draft" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tips" (
	"tx_hash" text PRIMARY KEY NOT NULL,
	"from_wallet" text NOT NULL,
	"to_wallet" text NOT NULL,
	"amount_wei" numeric(78, 0) NOT NULL,
	"message" text,
	"block_number" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_wallet_address_users_wallet_address_fk" FOREIGN KEY ("wallet_address") REFERENCES "public"."users"("wallet_address") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "broadcast_guests" ADD CONSTRAINT "broadcast_guests_broadcast_id_broadcasts_id_fk" FOREIGN KEY ("broadcast_id") REFERENCES "public"."broadcasts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "broadcasts" ADD CONSTRAINT "broadcasts_user_id_users_wallet_address_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("wallet_address") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assets" ADD CONSTRAINT "assets_uploaded_by_users_wallet_address_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("wallet_address") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "art_pieces" ADD CONSTRAINT "art_pieces_user_id_users_wallet_address_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("wallet_address") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "art_pieces" ADD CONSTRAINT "art_pieces_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_wallet_address_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("wallet_address") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_drafts" ADD CONSTRAINT "profile_drafts_user_id_users_wallet_address_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("wallet_address") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessions_wallet_idx" ON "sessions" USING btree ("wallet_address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "broadcasts_user_started_idx" ON "broadcasts" USING btree ("user_id","started_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "broadcasts_live_heartbeat_idx" ON "broadcasts" USING btree ("is_live","last_heartbeat_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "art_pieces_user_position_idx" ON "art_pieces" USING btree ("user_id","position");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "follows_followee_idx" ON "follows" USING btree ("followee_wallet");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notifications_user_created_idx" ON "notifications" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tips_to_created_idx" ON "tips" USING btree ("to_wallet","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tips_from_created_idx" ON "tips" USING btree ("from_wallet","created_at" DESC NULLS LAST);