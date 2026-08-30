import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";

import { mongodbAdapter } from "better-auth/adapters/mongodb";

import { MongoClient } from "mongodb";
import { sendResetEmail } from "./email";

const client = new MongoClient(process.env.MONGO_URI!);

export const auth = betterAuth({
  database: mongodbAdapter(client.db("in-touch")),

  emailAndPassword: {
    enabled: true,

    sendResetPassword: async ({ user, url }) => {
      await sendResetEmail(user.email, url);
    },
  },

  //   socialProviders: {
  //     google: {
  //       clientId: process.env.GOOGLE_CLIENT_ID,

  //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  //     },
  //   },

  baseURL: process.env.BETTER_AUTH_URL,

  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: ["http://localhost:5173"],
  plugins: [username()],
});
