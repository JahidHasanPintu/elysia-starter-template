import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../db/index";
import { openAPI } from "better-auth/plugins"
import { user, account, verification, session } from "../../db/schema";
import { sendMail } from "../mail";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: user,
      session: session,
      account: account,
      verification: verification
    }
  }),
  emailAndPassword: {
    enabled: true, // If you want to use email and password auth
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }, request) => {
      await sendMail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendMail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },

  },
  plugins: [
    openAPI({
      path: "/docs",
    }),
  ],
  socialProviders: {
    /*
     * We're using Google and Github as our social provider,
     * make sure you have set your environment variables
     */
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID!,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // },
    // google: {
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // },
  },
});
