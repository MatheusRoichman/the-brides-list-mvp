"use server";

import { db } from "@/db";
import { reservations, products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function listReservations() {
  const rows = await db
    .select({
      id: reservations.id,
      reserverName: reservations.reserverName,
      whatsapp: reservations.whatsapp,
      message: reservations.message,
      createdAt: reservations.createdAt,
      product: {
        id: products.id,
        name: products.name,
        imageUrl: products.imageUrl,
      },
    })
    .from(reservations)
    .innerJoin(products, eq(reservations.productId, products.id))
    .orderBy(desc(reservations.createdAt));

  return rows;
}
