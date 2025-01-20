import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { user } from "./auth";

export const note = pgTable(
  "note",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `note_${createId()}`),
    title: text("title"),
    content: text("content"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
    deletedAt: timestamp("deleted_at"),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id),
  },

  (table) => [
    index("idx_note_ownerid").on(table.ownerId),
    index("idx_note_createdat").on(table.createdAt),
    index("idx_note_deletedat").on(table.deletedAt),
  ],
);


export const attachment = pgTable(
  "note_attachments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `attachment_${createId()}`),
    title: text("title").default("Untitled"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
    filePath: text("file_path"),
    noteId: text("note_id")
      .notNull()
      .references(() => note.id),
  },
  (table) => [
    index("idx_attachment_attachmentId").on(table.noteId),
    index("idx_attachment_deletedat").on(table.deletedAt),
  ],
);
