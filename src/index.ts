import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { serverTiming } from "@elysiajs/server-timing";

import { note } from "./routes/note";
import { user } from "./routes/user";

const app = new Elysia()
  .use(opentelemetry())
  .use(swagger())
  .use(serverTiming())
  .onError(({ error, code }) => {
    if (code === "NOT_FOUND") return "Not Found :(";
    console.error(error);
  })
  .use(user)
  .use(note)
  .listen(3000);
