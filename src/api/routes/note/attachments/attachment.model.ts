import { createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { attachment } from "../../../../db/schema/note";
import { commonResponses } from "../../../../lib/utils/common";

export const _AttachmentSchema = createSelectSchema(attachment);

export const AttachmentSchema = t.Omit(_AttachmentSchema, ["deletedAt", "filePath"]);

export const AttachmentWithUrlSchema = t.Composite([ AttachmentSchema,t.Object({
  attachmentUrl: t.String({default:"http://example.com/attachment_abcd"}),
})])

export const createAttachmentSchema = t.Object({
  title: t.Optional(t.String()),
  noteId: t.String(),
  file: t.File(),
})

export type CreateAttachmentType = typeof createAttachmentSchema.static;


export const getAttachmentResponses = {
  200: t.Object(
    {
      success: t.Boolean({ default: true }),
      data: t.Array(AttachmentWithUrlSchema),
      error: t.Null(),
      message: t.String(),
    },
    {
      description: "Success",
    },
  ),
  ...commonResponses,
};

export const deleteAttachmentResponses = {
  200: t.Object(
    {
      success: t.Boolean({ default: true }),
      data: t.Null(),
      error: t.Null(),
      message: t.String({ default: "Attachment deletion succesful" }),
    },
    {
      description: "Success",
    },
  ),
  ...commonResponses,
};
