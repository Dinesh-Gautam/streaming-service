import { readFile } from "@/helpers/api/user/user";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../db/schemas/userSchema";

async function verifyUser(username, password) {
  const user = await User.findOne({ username });
  console.log(user);
  if (!user) {
    throw new Error("User does not exists");
  }
  if (user.password !== password) {
    throw new Error("invalid credentials");
  }

  return user;
}

const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials;

        const user = await verifyUser(email, password);
        // if everything is fine
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.username,
            role: user.role,
          };
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    // error: "/auth/signin",
    signOut: "/",
  },
  callbacks: {
    jwt(params) {
      // update token
      if (params.user?.role) {
        params.token.role = params.user.role;
      }
      // return final_token
      return params.token;
    },
  },
};

export default NextAuth(authOptions);
