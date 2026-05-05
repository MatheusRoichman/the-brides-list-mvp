"use server";

import { db } from "@/db";
import { reservations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface CancelReservationInput {
  token: string;
}

export async function cancelReservation(input: CancelReservationInput) {
  const result = await db
    .delete(reservations)
    .where(eq(reservations.cancellationToken, input.token))
    .returning();

  if (result.length > 0) {
    revalidatePath("/");
    revalidatePath("/admin/reservas");
    return { success: true };
  }

  return { success: false, error: "invalid_token" };
}
