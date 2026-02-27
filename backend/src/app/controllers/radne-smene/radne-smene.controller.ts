// src/app/controllers/radneSmene.controllers.ts
import { db } from "@/app/db";
import { radneSmene } from "@/app/db/schema";

/**
 * Vraca mapu smena po zaposlenom: { [employeeId]: ShiftDto[] }
 */
export async function getAllShiftsByEmployee() {
  const rows = await db.select().from(radneSmene);

  const map: Record<string, any[]> = {};

  for (const row of rows) {
    const employeeId = row.zaposleniId.toString();

    if (!map[employeeId]) map[employeeId] = [];

    map[employeeId].push({
      id: row.idSmene.toString(),
      date: row.datum,
      startTime: row.pocetakSmene,
      endTime: row.krajSmene,
    });
  }

  return map;
}
