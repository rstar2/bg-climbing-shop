import { type NextRequest, NextResponse, NextFetchEvent } from "next/server";
import NextAuth from "next-auth";

import { authConfig } from "@/lib/auth/config";

const { auth } = NextAuth(authConfig);

/**
 * The matcher (as per the middleware's config convention)
 * https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

/**
 * 1. If auth is the only one middleware then this is enough.
 */
//export default auth;

/**
 * 2.
 * A combined middleware, allowing chaining
 * Note: Middleware currently only supports the Edge runtime,
 * not the Node.js runtime, so cannot use use modules like "bcrypt" which require Node.js
 */
export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  // @ts-ignore - the "auth" is also a real middleware (as if used like "export default auth"),
  // so just call it, but the types are not good and they say the returned object is a Session,
  // while it's a Response
  const response: Response = await auth(req, ev);

  // return the response from the auth middleware, but this allows to add other middlewares
  return response;
}

/**
 * 3. Same as 2. can be achieved by wrapping the custom middleware with "auth".
 * "auth" is universal function, that depends very much on the types of the arguments it receives.
 * Note this wrapped middleware will be called
 * only if the auth middleware (e.g. the config.callbacks.authorized)
 * has not already returned a valid response like when redirecting to the signin page
 */
// export default auth((req) => {
//   const session = req.auth;
//   //if (session) => user is authorized other
// });
