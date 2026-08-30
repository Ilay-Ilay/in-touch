import { authClient } from "#lib/auth";

export async function oAuth() {
  await authClient.signIn.social({
    provider: "google",

    callbackURL: "/chat",
  });
}
