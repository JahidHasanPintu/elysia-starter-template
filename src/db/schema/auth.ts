import {
  text,
  integer,
  timestamp,
  boolean,
  pgSchema,
  index,
} from "drizzle-orm/pg-core";

export const authSchema = pgSchema("auth");

export const user = authSchema.table(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
);

export const session = authSchema.table("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
},
(table) => [index("idx_auth_session_ip_address").on(table.ipAddress), index("idx_auth_session_userid").on(table.userId)]
);

export const account = authSchema.table("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
},
(table) => [index("idx_auth_account_userid").on(table.userId), index("idx_auth_account_refreshtokenexpiresat").on(table.refreshTokenExpiresAt), index("idx_auth_account_providerid").on(table.providerId)]);

export const verification = authSchema.table("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
},
(table) => [index("idx_auth_verification_identifier").on(table.identifier), index("idx_auth_verification_expires_at").on(table.expiresAt)]);

export const rateLimit = authSchema.table("rate_limit", {
  id: text("id").primaryKey(),
  key: text("key"),
  count: integer("count"),
  lastRequest: integer("last_request"),
},
(table) => [index("idx_auth_ratelimit_key").on(table.key)]);

export const jwks = authSchema.table("jwks", {
  id: text("id").primaryKey(),
  publicKey: text("public_key").notNull(),
  privateKey: text("private_key").notNull(),
  createdAt: timestamp("created_at").notNull(),
});