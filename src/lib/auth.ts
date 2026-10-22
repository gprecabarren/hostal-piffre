import "server-only";
import NextAuth, { type Session } from "next-auth";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { isAllowedAdmin, isAllowedVercelProfile } from "./validation";

declare module "next-auth" {
  interface Session {
    adminVerified?: boolean;
  }
}
const adminEmails = () => process.env.ADMIN_EMAILS || "alojamientospiffre@gmail.com";
export const authConfigured = Boolean(process.env.AUTH_SECRET && process.env.AUTH_VERCEL_ID && process.env.AUTH_VERCEL_SECRET);
const vercelKeys = createRemoteJWKSet(new URL("https://vercel.com/.well-known/jwks"), { timeoutDuration: 8000 });

async function verifyVercelIdToken(idToken: string | undefined): Promise<Record<string, unknown> | undefined> {
  if (!idToken || !process.env.AUTH_VERCEL_ID) return undefined;
  try {
    const { payload } = await jwtVerify(idToken, vercelKeys, {
      issuer: "https://vercel.com",
      audience: process.env.AUTH_VERCEL_ID,
      algorithms: ["RS256"],
      requiredClaims: ["sub", "iss", "aud", "exp", "iat", "nonce"],
      clockTolerance: 5,
    });
    return payload;
  } catch {
    return undefined;
  }
}

const nextAuth = NextAuth({
  secret: process.env.AUTH_SECRET,
  // The application is deployed by Vercel, which supplies the trusted request host.
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/admin", error: "/admin" },
  providers: [{
    id: "vercel",
    name: "Vercel",
    type: "oidc",
    idToken: true,
    issuer: "https://vercel.com",
    clientId: process.env.AUTH_VERCEL_ID,
    clientSecret: process.env.AUTH_VERCEL_SECRET,
    client: { token_endpoint_auth_method: "client_secret_basic" },
    authorization: { params: { scope: "openid email profile" } },
    checks: ["pkce", "state", "nonce"],
    // Auth.js handles discovery, issuer/audience/expiry, PKCE, state and nonce.
    // We additionally verify the ID token signature using Vercel's published JWKS.
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name || profile.preferred_username || "Administración",
        email: typeof profile.email === "string" ? profile.email.toLowerCase() : null,
        image: typeof profile.picture === "string" ? profile.picture : null,
      };
    },
  }],
  callbacks: {
    async signIn({ account }) {
      if (account?.provider !== "vercel") return false;
      const claims = await verifyVercelIdToken(account.id_token);
      return isAllowedVercelProfile(claims, process.env.AUTH_VERCEL_ID || "", adminEmails());
    },
    async jwt({ token, account }) {
      if (account) {
        const claims = account.provider === "vercel" ? await verifyVercelIdToken(account.id_token) : undefined;
        token.vercelVerified = isAllowedVercelProfile(claims, process.env.AUTH_VERCEL_ID || "", adminEmails());
        token.email = typeof claims?.email === "string" ? claims.email.toLowerCase() : null;
      }
      // No access/refresh/ID tokens are copied into the session cookie or browser.
      return token;
    },
    session({ session, token }) {
      session.adminVerified = token.vercelVerified === true && isAllowedAdmin(token.email, adminEmails());
      if (session.user && typeof token.email === "string") session.user.email = token.email;
      return session;
    },
  },
});

export const { handlers, signIn, signOut } = nextAuth;

export async function auth(): Promise<Session | null> {
  return authConfigured ? nextAuth.auth() : null;
}

export function isAdminSession(session: Session | null | undefined): boolean {
  return session?.adminVerified === true && isAllowedAdmin(session.user?.email, adminEmails());
}
