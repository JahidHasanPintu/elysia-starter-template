CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE TABLE "auth"."account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."jwks" (
	"id" text PRIMARY KEY NOT NULL,
	"public_key" text NOT NULL,
	"private_key" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."rate_limit" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text,
	"count" integer,
	"last_request" integer
);
--> statement-breakpoint
CREATE TABLE "auth"."session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "auth"."user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "auth"."verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "note_attachments" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text DEFAULT 'Untitled',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"file_path" text,
	"note_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "note" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"content" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp,
	"owner_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth"."account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note_attachments" ADD CONSTRAINT "note_attachments_note_id_note_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."note"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note" ADD CONSTRAINT "note_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_auth_account_userid" ON "auth"."account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_auth_account_refreshtokenexpiresat" ON "auth"."account" USING btree ("refresh_token_expires_at");--> statement-breakpoint
CREATE INDEX "idx_auth_account_providerid" ON "auth"."account" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "idx_auth_ratelimit_key" ON "auth"."rate_limit" USING btree ("key");--> statement-breakpoint
CREATE INDEX "idx_auth_session_ip_address" ON "auth"."session" USING btree ("ip_address");--> statement-breakpoint
CREATE INDEX "idx_auth_session_userid" ON "auth"."session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_auth_verification_identifier" ON "auth"."verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "idx_auth_verification_expires_at" ON "auth"."verification" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "idx_attachment_attachmentId" ON "note_attachments" USING btree ("note_id");--> statement-breakpoint
CREATE INDEX "idx_attachment_deletedat" ON "note_attachments" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_note_ownerid" ON "note" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "idx_note_createdat" ON "note" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_note_deletedat" ON "note" USING btree ("deleted_at");