import { NextResponse } from "next/server";
import type { NextAuthConfig } from "next-auth";

export const publicRoutes = ["/", "/auth/signin"];
export const protectedRedirectRoute = "/dashboard";

export const authConfig = {
  pages: {
    signIn: "/auth/signin",
    // signOut: "/",
    // error: "/",
  },
  session: {
    // it's the default
    // strategy: "jwt",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt
    // which is only compatible with Node.js
    // while this file is also used in non-Node.js environments,
    // actually it's used from middleware.ts which runs in Edge Runtime only
  ],
  callbacks: {
    // auth is Session and request is the NextRequest
    authorized({ auth, request }) {
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    redirect({ url, baseUrl }) {
      // NOTE: for some reason the "signIn()" method of NextAuth
      // redirects again to "....?callbackUrl=...." which is again the same url of the ServerAction
      // Example auth redirects to login page like http://localhost:3000/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fdashboard
      // and when "signIn" ServerAction is executed then it stays on the same url which is wrong
      // I think this is a bug, but it can be patched either with this "redirect" callback,
      // or if the "signIn" ServerAction receive also a "redirectTo" prop in the FormData (after debugging the NextAuth source),
      // but this means to parse in the client component the URL and check for this "callbackUrl"

      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else {
        let redirectUrl = baseUrl;
        // Allows callback URLs on the same origin
        if (new URL(url).origin === baseUrl) redirectUrl = url;

        const callbackUrl = new URL(redirectUrl).searchParams.get("callbackUrl");
        if (callbackUrl) redirectUrl = callbackUrl;

        return redirectUrl;
      }
    },
  },
} satisfies NextAuthConfig;
