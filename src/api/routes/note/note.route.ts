import { Elysia, t } from "elysia";
import {
  createNoteSchema,
  deleteNoteResponses,
  getNoteResponses,
  NoteSchema,
} from "./note.model";
import { NoteController } from "./note.controller";
import { userMiddleware } from "../../../middlewares/auth-middleware";

export const noteRouter = new Elysia({
  prefix: "/note",
  name: "CRUD Operations for Notes",
  analytic: true,
  tags: ["Note"],
  detail: {
    description: "Notes CRUD operations",
  },
})
  .decorate("note", new NoteController())
  .model({
    note: NoteSchema,
  })
  .derive(({ request }) => userMiddleware(request))
  .onError(({ error, code }) => {
    console.error(error);
    return {
      message: "",
      success: false,
      data: null,
      error: code.toString(),
    };
  })
  .get(
    "",
    async ({ note, user, query }) => {
      return await note.getOwnerNotes(user.id, query.limit, query.offset);
    },
    {
      query: t.Object({
        limit: t.Optional(t.Number()),
        offset: t.Optional(t.Number()),
      }),
      response: getNoteResponses,
      detail: {
        description: "Get all notes of the user",
        summary: "Get all notes",
      },
    },
  )
  .get(
    "/:id",
    async ({ note, user, params: { id } }) => {
      return await note.getNoteById(id, user.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: getNoteResponses,
      detail: {
        description: "Get a note by Id",
        summary: "Get a note",
      },
    },
  )
  .post(
    "",
    async ({ body, note, user }) => {
      return await note.createNote(body, user.id);
    },
    {
      body: createNoteSchema,
      response: getNoteResponses,
      detail: {
        description: "Create a new note",
        summary: "Create a note",
      },
    },
  )
  .patch(
    "/:id",
    async ({ body, note, user, params: { id } }) => {
      return await note.updateNoteById(id, body, user.id);
    },
    {
      body: createNoteSchema,
      params: t.Object({
        id: t.String(),
      }),
      response: getNoteResponses,
      detail: {
        description: "Update a note by Id",
        summary: "Update a note",
      },
    },
  )
  .delete(
    "/:id",
    async ({ note, user, params: { id } }) => {
      return await note.deleteNoteById(id, user.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: deleteNoteResponses,
      detail: {
        description: "Delete a note by Id",
        summary: "Delete a note",
      },
    },
  )
  .delete(
    "",
    async ({ note, user }) => {
      return await note.deleteAllNotes(user.id);
    },
    {
      response: deleteNoteResponses,
      detail: {
        description: "Delete all notes of an user",
        summary: "Delete all notes",
      },
    },
  );
