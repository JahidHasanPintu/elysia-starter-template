import { treaty } from '@elysiajs/eden'
import { app } from '../src'
import { getAuthConfig } from '../src/lib/utils/env';

async function getAuthToken() {
  const authUrl = getAuthConfig().BETTER_AUTH_URL
  const response = await fetch(`${authUrl}/api/auth/sign-in/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: "test@test.com",
      password: "testpass123"
    })
  });
  const cookies = response.headers.getSetCookie()[0];
  const sessionToken = cookies.split(";")[0].split("=")[1]
  return sessionToken;
}

const token = await getAuthToken();
export const testClientApp = treaty(app,{
    headers: {
        Cookie: `better-auth.session_token=${token}`
    }
})