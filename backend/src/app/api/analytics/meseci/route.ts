import { db } from "@/app/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await db.execute(sql`
      SELECT
        EXTRACT(MONTH FROM datum_vreme)::int AS mesec,
        COUNT(*)::int AS broj
      FROM rezervacije
      GROUP BY mesec
      ORDER BY mesec;
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Analytics meseci error:", error);
    return NextResponse.json(
      { error: "Greška pri dohvatanju statistike po mesecima" },
      { status: 500 }
    );
  }
}