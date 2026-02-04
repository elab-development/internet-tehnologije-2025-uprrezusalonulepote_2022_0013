import "dotenv/config";
import { db } from "./index";
import * as schema from "./schema";

async function main() {
  try {
    // --------- Services ----------
    const haircut = await db
      .insert(schema.Service)
      .values({ name: "Šišanje", price: "15" })
      .returning();

    const manicure = await db
      .insert(schema.Service)
      .values({ name: "Manikir", price: "20" })
      .returning();

    // --------- Employees ----------
    const ana = await db
      .insert(schema.Employee)
      .values({ name: "Ana" })
      .returning();

    const maja = await db
      .insert(schema.Employee)
      .values({ name: "Maja" })
      .returning();

    // --------- Employee ↔ Service (N:N) ----------
    // Ana radi Šišanje
    await db.insert(schema.EmployeeService).values({
      employee_id: ana[0].id,
      service_id: haircut[0].id,
    });

    // Maja radi Manikir
    await db.insert(schema.EmployeeService).values({
      employee_id: maja[0].id,
      service_id: manicure[0].id,
    });

    console.log("Seed podaci uspešno ubačeni!");
  } catch (err) {
    console.error("Greška prilikom seed-a:", err);
  }
}

main();
