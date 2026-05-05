"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { env } from "@/env";

const COOKIE_NAME = "admin_session";
const COOKIE_VALUE = "authenticated";

export async function login(password: string): Promise<boolean> {
  if (password !== env.ADMIN_PASSWORD) {
    return false;
  }

  const jar = await cookies();

  jar.set(COOKIE_NAME, COOKIE_VALUE, {
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
  const jar = await cookies();
  const session = jar.get(COOKIE_NAME);

  if (session?.value !== COOKIE_VALUE) {
    redirect("/admin/login");
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const session = jar.get(COOKIE_NAME);

  return session?.value === COOKIE_VALUE;
}
