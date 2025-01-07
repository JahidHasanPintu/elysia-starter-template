import { t } from "elysia";

export const memoSchema = t.Object({
  data: t.String(),
});

export type Memo = typeof memoSchema.static;
