import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

import { createId } from "@paralleldrive/cuid2";
import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";

export const user = pgTable("user", {
  id: varchar("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  username: varchar("username").notNull().unique(),
  password: varchar("password").notNull(),
  email: varchar("email").notNull().unique(),
  salt: varchar("salt", { length: 64 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const _createUser = createInsertSchema(user, {
  email: t.String({ format: "email" }),
});

// ✅ This works, by referencing the type from `drizzle-typebox`
export const createUserType = t.Omit(_createUser, ["id", "salt", "createdAt"]);
