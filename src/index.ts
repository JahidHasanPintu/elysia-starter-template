import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { serverTiming } from "@elysiajs/server-timing";
import { cors } from "@elysiajs/cors";
import { getBaseConfig, validateEnv } from "./lib/utils/env";
import { api } from "./api";

const baseConfig = getBaseConfig();

validateEnv();

export const app = new Elysia()
  .use(cors())
  .use(
    opentelemetry({
      serviceName: baseConfig.SERVICE_NAME,
    }),
  )
  .use(serverTiming())
  .use(
    swagger({
      path: "/api/docs",
      documentation: {
        info: {
          title: baseConfig.SERVICE_NAME,
          version: "0.0.1",
          description: `API docs for ${baseConfig.SERVICE_NAME}`,
        },
      },
    }),
  )
  .onError(({ error, code }) => {
    if (code === "NOT_FOUND")
      return {
        message: `Not Found`,
        success: false,
        name: baseConfig.SERVICE_NAME,
        status: "active",
        docs: {
          default: "/api/docs",
          auth: "/api/auth/docs",
        },
      };
    console.error(error);
  })
  .use(api);
app.listen(baseConfig.PORT);
console.log(`Server is running on: http://127.0.0.1:${baseConfig.PORT}`);
