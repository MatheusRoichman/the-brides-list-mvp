"use server";

import { db } from "@/db";
import { reservations, products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function verifyToken(token: string) {
  const [row] = await db
    .select({
      id: reservations.id,
      productId: reservations.productId,
      productName: products.name,
    })
    .from(reservations)
    .innerJoin(products, eq(reservations.productId, products.id))
    .where(eq(reservations.cancellationToken, token))
    .limit(1);

  return row || null;
}
