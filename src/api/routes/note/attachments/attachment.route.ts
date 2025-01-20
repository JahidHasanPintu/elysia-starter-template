import { Elysia, t } from "elysia";
import {
  createAttachmentSchema,
  deleteAttachmentResponses,
  getAttachmentResponses,
  AttachmentSchema,
} from "./attachment.model";
import { AttachmentController } from "./attachment.controller";
import { userMiddleware } from "../../../../middlewares/auth-middleware";

export const attachmentRouter = new Elysia({
  prefix: "/attachment",
  name: "CRUD Operations for Attachments",
  analytic: true,
  tags: ["Attachment"],
  detail: {
    description: "Attachments CRUD operations",
  },
})
  .decorate("attachment", new AttachmentController())
  .model({
    attachment: AttachmentSchema,
  })
  .derive(({ request }) => userMiddleware(request))
  .onError(({ path, error, code }) => {
    console.error(error);
    return {
      message: path+" Error:"+code,
      success: false,
      data: null,
      error: code.toString(),
    };
  })
  .get(
    "",
    async ({ attachment, user, query }) => {
      return await attachment.getAttachmentsByNoteId(query.noteId, user.id, query.limit, query.offset);
    },
    {
      query: t.Object({
        noteId:t.String(),
        limit: t.Optional(t.Number()),
        offset: t.Optional(t.Number()),
      }),
      response: getAttachmentResponses,
      detail: {
        description: "Get all attachments of the user",
        summary: "Get all attachments",
      },
    },
  )
  .get(
    "/:id",
    async ({ attachment, user, params }) => {
      return await attachment.getAttachmentById(params.id, user.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: getAttachmentResponses,
      detail: {
        description: "Get a attachment by Id",
        summary: "Get a attachment",
      },
    },  
  )
  .post(
    "",
    async ({ body, attachment, user }) => {
      return await attachment.createAttachment(body, user.id);
    },
    {
      body: createAttachmentSchema,
      response: getAttachmentResponses,
      detail: {
        description: "Create a new attachment",
        summary: "Create a attachment",
      },
    },
  )
  .delete(
    "/:id",
    async ({ attachment, user, params: { id } }) => {
      return await attachment.deleteAttachmentById(id, user.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: deleteAttachmentResponses,
      detail: {
        description: "Delete a attachment by Id",
        summary: "Delete a attachment",
      },
    },
  )
  .delete(
    "",
    async ({ attachment, user, query }) => {
      return await attachment.deleteAllAttachmentsByNoteId(query.noteId, user.id);
    },
    {
      query: t.Object({
        noteId:t.String(),
      }),
      response: deleteAttachmentResponses,
      detail: {
        description: "Delete all attachments of an user",
        summary: "Delete all attachments",
      },
    },
  );
