import { createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { note } from "../../db/schema/note";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";


export const SelectNoteSchema = createSelectSchema(note);

export const NoteSchema = t.Omit(SelectNoteSchema, ["deletedAt", "ownerId"]);

export type Note = InferSelectModel<typeof note>;
export type CreateNote = Pick<
  InferInsertModel<typeof note>,
  "title" | "content"
>;
export const createNoteSchema = t.Pick(NoteSchema, [
  "title",
  "content",
]);

export const successGetNoteResponse = t.Object({
    success:t.Boolean({default:true}),
    data: t.Array(NoteSchema),
    error: t.Null(),
    message: t.String()
}, {
    description:"Success"
})

export const successDeleteNoteResponse = t.Object({
    success:t.Boolean({default:true}),
    data: t.Null(),
    error: t.Null(),
    message: t.String({default:"Note deletion succesful"})
}, {
    description:"Success"
})