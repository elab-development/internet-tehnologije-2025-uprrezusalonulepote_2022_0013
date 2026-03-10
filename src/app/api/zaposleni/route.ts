import { db } from "@/app/db";
import { zaposleni } from "@/app/db/schema";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const list = await db
    .select({
      id: zaposleni.idZaposleni,
      ime: zaposleni.ime,
      prezime: zaposleni.prezime,
      email: zaposleni.email,
      role: zaposleni.role,
      radnoMestoId: zaposleni.radnoMestoId,
    })
    .from(zaposleni);

  return NextResponse.json({ zaposleni: list });
}
