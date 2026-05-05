"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

import { env } from "@/env";

const COOKIE_NAME = "admin_session";
const secretKey = new TextEncoder().encode(env.ADMIN_JWT_SECRET);

export async function login(password: string): Promise<boolean> {
  if (password !== env.ADMIN_PASSWORD) {
    return false;
  }

  const jar = await cookies();

  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);

  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return true;
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function requireAuth(): Promise<void> {
  const isAuth = await isAuthenticated();

  if (!isAuth) {
    redirect("/admin/login");
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const session = jar.get(COOKIE_NAME);

  if (!session?.value) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(session.value, secretKey);
    return payload.role === "admin";
  } catch (error) {
    return false;
  }
}
