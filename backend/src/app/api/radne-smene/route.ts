// src/app/api/radne-smene/route.ts
import { NextResponse } from "next/server";
import { getAllShiftsByEmployee } from "@/app/controllers/radne-smene/radne-smene.controller";
import { requireAuth } from "@/app/lib/guards";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = await requireAuth(["ADMIN"]);
  if (!auth.ok) return auth.res;

  try {
    const shiftsMap = await getAllShiftsByEmployee();
    return NextResponse.json(shiftsMap);
  } catch (err) {
    console.error("Greška pri dohvatanju smena:", err);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}
