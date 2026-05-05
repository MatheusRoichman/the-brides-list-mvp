"use server";

import { createReservation, CreateReservationResult, CancelReservationInput, cancelReservation, verifyToken } from "@/services/reservations";
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function createReservationAction(formData: FormData): Promise<CreateReservationResult | { success: false, error: "missing_fields" }> {
  const productId = formData.get("productId") as string;
  const reserverName = formData.get("reserverName") as string;
  const whatsapp = formData.get("whatsapp") as string;
  const message = formData.get("message") as string;

  if (!productId || !reserverName) {
    return { success: false, error: "missing_fields" };
  }

  return await createReservation({
    productId,
    reserverName,
    whatsapp: whatsapp || undefined,
    message: message || undefined,
  });
}

export async function cancelReservationAction(token: string) {
  if (!token) return { success: false, error: "missing_token" };

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") || "unknown";
  
  // 10 req / minute
  const isAllowed = checkRateLimit(ip, 10, 60 * 1000);
  
  if (!isAllowed) {
    return { success: false, error: "too_many_requests" };
  }

  return await cancelReservation({ token });
}

export async function verifyTokenAction(token: string) {
  return await verifyToken(token);
}
