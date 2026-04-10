import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { serverTrpc } from "../trpc-server";

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: { scope: "read:user user:email" },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile, account }) {
      try {
        const authResult = await serverTrpc.auth.googleAuth.mutate({
          email: user.email!,
          firstName: user.name ?? (profile as any)?.name,
          authMethod: account?.provider ?? "google",
          providerAccountId: account?.providerAccountId,
          access_token: account?.access_token,
          refresh_token: account?.refresh_token,
          id_token: account?.id_token,
          expires_at: account?.expires_at,
          token_type: account?.token_type,
          scope: account?.scope,
        });

        // Store user metadata in user object for JWT callback
        if (authResult?.user) {
          (user as any).createdAt = authResult.user.createdAt;
          (user as any).role = authResult.user.role;
          (user as any).status = authResult.user.status;
        }

        return true;
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
    },

    async session({ session, token }) {
      // Add metadata from token to session
      if (session.user) {
        if (token.createdAt) session.user.createdAt = token.createdAt as string;
        if (token.role) (session.user as any).role = token.role as string;
        if (token.status) (session.user as any).status = token.status as string;
      }

      return {
        ...session,
        accessToken: token.jwtToken,
        expires: session.expires,
      };
    },

    async jwt({ token, account, user }) {
      if (account && user) {
        try {
          const data = await serverTrpc.auth.generateJWT.mutate({
            email: user.email!,
          });

          token.jwtToken = data.token;

          // Store metadata in token if available
          if ((user as any).createdAt) {
            token.createdAt = new Date((user as any).createdAt).toISOString();
          }
          if ((user as any).role) {
            token.role = (user as any).role;
          }
          if ((user as any).status) {
            token.status = (user as any).status;
          }
        } catch (error) {
          console.error("JWT token error:", error);
        }
      }
      return token;
    },

  },
  pages: {
    signIn: "/login",
  },
};
