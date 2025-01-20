import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
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
},

(table) => [index("idx_note_ownerid").on(table.ownerId), index("idx_note_createdat").on(table.createdAt), index("idx_note_deletedat").on(table.deletedAt)]
)