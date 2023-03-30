import { readFile } from "@/helpers/api/user/user";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      authorize(credentials, req) {
        const { email, password } = credentials;

        const userData = readFile("db/userData.json");
        console.log(userData);
        const user = userData.find((e) => e.username === email);
        console.log(user);
        if (!user) {
          throw new Error("User does not exists");
        }

        if (password !== user.password) {
          throw new Error("invalid credentials");
        }

        // if everything is fine
        return {
          id: user.id,
          name: user.name,
          email: user.username,
          role: user.role,
        };
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
