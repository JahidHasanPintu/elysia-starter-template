import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { serverTiming } from "@elysiajs/server-timing";

import { note } from "./api/note/note.route";
import { betterAuthView } from "./lib/auth/auth-view";
import { userMiddleware, userInfo } from "./middlewares/auth-middleware";

const app = new Elysia()
  .use(opentelemetry())
  .use(swagger())
  .use(serverTiming())
  .onError(({ error, code }) => {
    if (code === "NOT_FOUND") return "Not Found :(";
    console.error(error);
  })
  .use(note)
  .derive(({ request }) => userMiddleware(request))
  .all("/api/auth/*", betterAuthView)
  .get("/user", ({ user, session }) => userInfo(user, session));

app.listen(3000);
