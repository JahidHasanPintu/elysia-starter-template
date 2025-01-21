import { createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { note } from "../../../db/schema/note";
import { InferInsertModel } from "drizzle-orm";
import { commonResponses } from "../../../lib/utils/common";

export const _NoteSchema = createSelectSchema(note);

export const NoteSchema = t.Omit(_NoteSchema, ["deletedAt", "ownerId"]);

export type CreateNoteType = Pick<
  InferInsertModel<typeof note>,
  "title" | "content"
>;

export const createNoteSchema = t.Partial(
  t.Pick(NoteSchema, ["title", "content"]),
);

export const getNoteResponses = {
  200: t.Object(
    {
      success: t.Boolean({ default: true }),
      data: t.Array(NoteSchema),
      error: t.Null(),
      message: t.String(),
    },
    {
      description: "Success",
    },
  ),
  ...commonResponses,
};

export const deleteNoteResponses = {
  200: t.Object(
    {
      success: t.Boolean({ default: true }),
      data: t.Null(),
      error: t.Null(),
      message: t.String({ default: "Note deletion succesful" }),
    },
    {
      description: "Success",
    },
  ),
  ...commonResponses,
};
