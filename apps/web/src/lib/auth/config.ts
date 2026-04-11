import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const result = await serverTrpc.auth.login.mutate({
            email: credentials.email,
            password: credentials.password,
          });

          if (result.user) {
            return {
              id: result.user.id,
              email: result.user.email,
              name: result.user.firstName,
              jwtToken: result.token, // Pass token to jwt callback
            };
          }
          return null;
        } catch (error: any) {
          throw new Error(error.message || "Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile, account }) {
      if (account?.provider === "credentials") return true;
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

        // Store user metadata and token for the JWT callback to prevent redundant calls
        if (authResult?.user) {
          (user as any).createdAt = authResult.user.createdAt;
          (user as any).role = authResult.user.role;
          (user as any).status = authResult.user.status;
          (user as any).jwtToken = authResult.token;
        }

        return true;
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
    },

    async session({ session, token }) {
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
      // First login / Sign in
      if (user) {
        const u = user as any;
        token.jwtToken = u.jwtToken;
        
        if (u.createdAt) {
          token.createdAt = new Date(u.createdAt).toISOString();
        }
        if (u.role) {
          token.role = u.role;
        }
        if (u.status) {
          token.status = u.status;
        }
      } 
      // Fallback: If for some reason token is missing but user is already signed in
      else if (token.email && !token.jwtToken) {
         try {
          const data = await serverTrpc.auth.generateJWT.mutate({
            email: token.email as string,
          });
          token.jwtToken = data.token;
        } catch (error) {
          console.error("JWT sync error:", error);
        }
      }

      return token;
    },

  },
  pages: {
    signIn: "/login",
  },
};
