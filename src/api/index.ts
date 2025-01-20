import { Elysia, t } from "elysia";

import { betterAuthView } from "../lib/auth/auth-view";
import { getAuthConfig, getBaseConfig } from "../lib/utils/env";
import { router } from "./routes";

const baseConfig = getBaseConfig();
const authConfig = getAuthConfig();

export const api = new Elysia({
  name: baseConfig.SERVICE_NAME,
  prefix: "/api",
  detail: {
    summary: `Get status`,
    description: `Get status for ${baseConfig.SERVICE_NAME}`,
    externalDocs: {
      description: "Auth API",
      url: `${authConfig.BETTER_AUTH_URL}/docs`,
    },
  },
})
  .all("/auth/*", betterAuthView)
  .use(router)
  .get(
    "",
    () => {
      return {
        message: `Server is running`,
        success: true,
        name: baseConfig.SERVICE_NAME,
        status: "active",
        docs: {
          default: "/api/docs",
          auth: "/api/auth/docs",
        },
      };
    },
    {
      response: {
        200: t.Object(
          {
            message: t.String({ default: `Server is running` }),
            success: t.Boolean({ default: true }),
            name: t.String({ default: baseConfig.SERVICE_NAME }),
            status: t.String({ default: `active` }),
            docs: t.Object({
              default: t.String({ default: "/api/docs" }),
              auth: t.String({ default: "/api/auth/docs" }),
            }),
          },
          {
            description: "Success",
          },
        ),
        404: t.Object(
          {
            message: t.String({ default: `Not found` }),
            success: t.Boolean({ default: false }),
            name: t.String({ default: baseConfig.SERVICE_NAME }),
            status: t.String({ default: `active` }),
            docs: t.Object({
              default: t.String({ default: "/api/docs" }),
              auth: t.String({ default: "/api/auth/docs" }),
            }),
          },
          {
            description: "Not found",
          },
        ),
      },
    },
  );
