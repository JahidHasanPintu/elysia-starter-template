import { Elysia, t } from "elysia";
import { Note } from "./note.controller";
import { memoSchema } from "./note.model";

export const note = new Elysia({ prefix: "/note" })
  .decorate("note", new Note())
  .model({
    memo: t.Omit(memoSchema, ["author"]),
  })
  .get("/", ({ note }) => note.data)
  .put("/", ({ note, body: { data } }) => note.add({ data }), {
    body: "memo",
  })
  .get(
    "/:index",
    ({ note, params: { index }, error }) => {
      return note.data[index] ?? error(404, "Not Found :(");
    },
    {
      params: t.Object({
        index: t.Number(),
      }),
    }
  )
  .guard({
    params: t.Object({
      index: t.Number(),
    }),
  })
  .delete("/:index", ({ note, params: { index }, error }) => {
    if (index in note.data) return note.remove(index);

    return error(422);
  })
  .patch(
    "/:index",
    ({ note, params: { index }, body: { data }, error }) => {
      if (index in note.data) return note.update(index, { data });
      return error(422);
    },
    {
      body: "memo",
    }
  );
