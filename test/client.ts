import { treaty } from "@elysiajs/eden";
import { app } from "../src";
import { getAuthConfig } from "../src/lib/utils/env";

const TEST_USER = {
  email: "test@test.com",
  password: "testpass123",
  name: "Test User",
};

async function createUserIfNotExists() {
  const authUrl = getAuthConfig().BETTER_AUTH_URL;

  // Try to sign in first
  try {
    const signInResponse = await fetch(`${authUrl}/api/auth/sign-in/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password,
      }),
    });

    // If sign in successful, return the session token
    if (signInResponse.ok) {
      const cookies = signInResponse.headers.getSetCookie()[0];
      return cookies.split(";")[0].split("=")[1];
    }
  } catch (error) {
    console.log("Sign in failed, attempting to create user...");
  }

  // If sign in fails, try to create the user
  try {
    const signUpResponse = await fetch(`${authUrl}/api/auth/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(TEST_USER),
    });

    if (!signUpResponse.ok) {
      throw new Error(`Failed to create user: ${signUpResponse.statusText}`);
    }

    // After creating user, sign in to get the token
    const signInResponse = await fetch(`${authUrl}/api/auth/sign-in/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password,
      }),
    });

    if (!signInResponse.ok) {
      throw new Error("Failed to sign in after creating user");
    }

    const cookies = signInResponse.headers.getSetCookie()[0];
    return cookies.split(";")[0].split("=")[1];
  } catch (error) {
    console.error("Error in user creation/authentication:", error);
    throw error;
  }
}

const token = await createUserIfNotExists();
export const testClientApp = treaty(app, {
  headers: {
    Cookie: `better-auth.session_token=${token}`,
  },
});
