import { t } from "elysia";

export const commonResponses = {
  400: t.Object(
    {
      data: t.Null(),
      success: t.Boolean({ default: false }),
      message: t.String({ default: "" }),
      error: t.Number({ default: 400 }),
    },
    {
      description:
        "Bad Request. Usually due to missing parameters, or invalid parameters.",
    }
  ),
  401: t.Object(
    {
      data: t.Null(),
      success: t.Boolean({ default: false }),
      message: t.String({ default: "" }),
      error: t.Number({ default: 401 }),
    },
    {
      description: "Unauthorized. Due to missing or invalid authentication.",
    }
  ),
  403: t.Object(
    {
      data: t.Null(),
      success: t.Boolean({ default: false }),
      message: t.String({ default: "" }),
      error: t.Number({ default: 403 }),
    },
    {
      description:
        "Forbidden. You do not have permission to access this resource or to perform this action.",
    }
  ),
  404: t.Object(
    {
      data: t.Null(),
      success: t.Boolean({ default: false }),
      message: t.String({ default: "" }),
      error: t.Number({ default: 404 }),
    },
    {
      description: "Not Found. The requested resource was not found.",
    }
  ),
  429: t.Object(
    {
      data: t.Null(),
      success: t.Boolean({ default: false }),
      message: t.String({ default: "" }),
      error: t.Number({ default: 429 }),
    },
    {
      description:
        "Too Many Requests. You have exceeded the rate limit. Try again later.",
    }
  ),
  500: t.Object(
    {
      data: t.Null(),
      success: t.Boolean({ default: false }),
      message: t.String({ default: "" }),
      error: t.Number({ default: 500 }),
    },
    {
      description:
        "Internal Server Error. This is a problem with the server that you cannot fix.",
    }
  ),
};
