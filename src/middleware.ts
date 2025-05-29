import { betterFetch } from "@better-fetch/fetch";
import { Session } from "better-auth/types";
import { NextRequest, NextResponse } from "next/server";
import { env } from "./env";

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: env.BETTER_AUTH_URL,
      headers: {
        cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
      },
    }
  );

  // if the session is found and the request is for the auth page, redirect to /me
  if (session && request.url.includes("/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // if the session is not found and the request is for /me or /auth, redirect to /auth/sign-in
  if (
    !session &&
    !request.url.includes("/auth/sign-in") &&
    !request.url.includes("/auth/sign-up")
  ) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout", "/cart", "/orders", "/auth/:auth*"],
};
