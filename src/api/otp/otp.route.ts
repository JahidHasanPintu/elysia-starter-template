import { Elysia, t } from "elysia";
import { renderToStaticMarkup } from "react-dom/server";
import nodemailer from "nodemailer";
import OTPEmail from "../../emails/otp";
import { createElement } from "react";

const transporter = nodemailer.createTransport({
  host: "smtp.gehenna.sh",
  port: 465,
  auth: {
    user: "makoto",
    pass: "12345678",
  },
});

export const otp = new Elysia({ prefix: "/otp" }).get(
  "/",
  async ({ body }) => {
    // Random between 100,000 and 999,999
    const otp = ~~(Math.random() * (900_000 - 1)) + 100_000;

    const html = renderToStaticMarkup(createElement(OTPEmail, { otp }));

    await transporter.sendMail({
      from: "ibuki@gehenna.sh",
      to: body,
      subject: "Verify your email address",
      html,
    });

    return { success: true };
  },
  {
    body: t.String({ format: "email" }),
  }
);
