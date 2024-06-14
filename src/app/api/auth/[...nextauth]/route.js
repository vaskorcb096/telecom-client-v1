import NextAuth from "next-auth/next";
import axiosInstance from "@/services/axiosInstance";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        const user = await axiosInstance.post("users/login", credentials);
        console.log(user.data)

        if (user.data) {
          return user.data.payload.userInfo;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      return { ...token, ...user };
    },
    async session({ session, user, token }) {
      // console.log("**** session :", session, "TOKENS", token, "users", user);
      if (token) {
        session.user = token;
      }
      return session;
    },
    async signIn(user) {
      // console.log('sign in : ', user, account, profile, email, credentials);
      // console.log('uuuuuuuuuser', user);

      if (user) return true;
      return false;
    },
    authorized({ req, token }) {
      if (token) return true; // If there is a token, the user is authenticated
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
