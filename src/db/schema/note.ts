import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from '@paralleldrive/cuid2'
import { user } from "./auth";

export const note = pgTable("note", {
  id: text("id").primaryKey().$defaultFn(()=> `note_${createId()}`),
  title: text("title"),
  content: text("content"),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp(),
  deletedAt: timestamp(),
  ownerId: text().notNull().references(() => user.id)
})