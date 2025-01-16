import { t } from "elysia";

export const commonResponses = {
  400: t.Object(
    {
      data: t.Null(),
      success: t.Boolean({ default: false }),
      message: t.String({ default: "Bad Request" }),
      error: t.String({
        default: "Missing parameters, or invalid parameters.",
      }),
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
      message: t.String({ default: "Unauthorized" }),
      error: t.String({
        default: "User needs to sign in to access this resource",
      }),
    },
    {
      description: "Unauthorized. Due to missing or invalid authentication.",
    }
  ),
  403: t.Object(
    {
      data: t.Null(),
      success: t.Boolean({ default: false }),
      message: t.String({ default: "Forbidden" }),
      error: t.String({
        default: "User does not have permission to access this resource",
      }),
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
      message: t.String({ default: "Not Found" }),
      error: t.String({ default: "Requested resource has not found" }),
    },
    {
      description: "Not Found. The requested resource was not found.",
    }
  ),
  429: t.Object(
    {
      data: t.Null(),
      success: t.Boolean({ default: false }),
      message: t.String({ default: "Too Many Requests" }),
      error: t.String({
        default: "RUser has exceeded the rate limit. Try again later.",
      }),
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
      message: t.String({ default: "Internal Server Error" }),
      error: t.String({ default: "Server faced an error" }),
    },
    {
      description:
        "Internal Server Error. This is a problem with the server that you cannot fix.",
    }
  ),
};
