import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { serverTiming } from "@elysiajs/server-timing";
import { cors } from '@elysiajs/cors'
import { note } from "./api/note/note.route";
import { betterAuthView } from "./lib/auth/auth-view";
import { userMiddleware, userInfo } from "./middlewares/auth-middleware";

const app = new Elysia()
  .use(cors())
  .use(opentelemetry())
  .use(swagger({
    path: "/docs",
  }))
  .use(serverTiming())
  .onError(({ error, code }) => {
    if (code === "NOT_FOUND") return "Not Found :(";
    console.error(error);
  })
  .derive(({ request }) => userMiddleware(request))
  .all("/api/auth/*", betterAuthView)
  .use(note)
  .get("/user", ({ user, session }) => userInfo(user, session));

app.listen(3000);

console.log("Server is running on: http://localhost:3000")
