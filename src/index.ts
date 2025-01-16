import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { serverTiming } from "@elysiajs/server-timing";
import { cors } from '@elysiajs/cors'
import { noteRouter } from "./api/note/note.route";
import { betterAuthView } from "./lib/auth/auth-view";
import { getBaseConfig, validateEnv } from "./lib/utils/env";

const baseConfig = getBaseConfig()

const app = new Elysia()
  .use(cors())
  .use(opentelemetry({
    "serviceName": baseConfig.SERVICE_NAME
  }))
  .use(swagger({
    path: "/docs",
  }))
  .use(serverTiming())
  .onError(({ error, code }) => {
    if (code === "NOT_FOUND") return "Not Found :(";
    console.error(error);
  })
  .all("/api/auth/*", betterAuthView)
  .use(noteRouter)
  .get("/", () => `${baseConfig.SERVICE_NAME} Server is Running`)

validateEnv();
app.listen(baseConfig.PORT);
console.log(`Server is running on: http://127.0.0.1:${baseConfig.PORT}`)
