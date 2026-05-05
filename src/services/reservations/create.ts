"use server";

import { db } from "@/db";
import { reservations } from "@/db/schema";
import { revalidatePath } from "next/cache";

export interface CreateReservationInput {
  productId: string;
  reserverName: string;
  whatsapp?: string;
  message?: string;
}

export type CreateReservationResult =
  | { success: true; token: string }
  | { success: false; error: "already_reserved" | "unknown" };

export async function createReservation(
  input: CreateReservationInput
): Promise<CreateReservationResult> {
  const cancellationToken = crypto.randomUUID();

  try {
    await db.insert(reservations).values({
      productId: input.productId,
      reserverName: input.reserverName,
      whatsapp: input.whatsapp,
      message: input.message,
      cancellationToken,
    });

    revalidatePath("/");
    // Also revalidate admin pages if they exist
    revalidatePath("/admin/reservas");

    return { success: true, token: cancellationToken };
  } catch (error: any) {
    // Check for unique constraint violation on productId
    if (error.code === "23505" && error.detail?.includes("product_id")) {
      return { success: false, error: "already_reserved" };
    }
    console.error("Failed to create reservation:", error);
    return { success: false, error: "unknown" };
  }
}
