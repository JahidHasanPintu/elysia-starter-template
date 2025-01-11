import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../db/index";
import { openAPI } from "better-auth/plugins"
import { user, account, verification, session } from "../../db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    // We're using Drizzle as our database
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
