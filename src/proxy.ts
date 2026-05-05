import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { env } from "./env";

export async function proxy(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const session = request.cookies.get("admin_session");
  
  let isAuthenticated = false;

  if (session?.value) {
    try {
      const secretKey = new TextEncoder().encode(env.ADMIN_JWT_SECRET);
      const { payload } = await jwtVerify(session.value, secretKey);
      isAuthenticated = payload.role === "admin";
    } catch (error) {
      console.error("JWT Verification failed:", error);
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/admin/products", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};
