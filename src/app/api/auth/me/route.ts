export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/app/db";
import { klijenti, zaposleni } from "@/app/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/app/lib/auth";

export async function GET() {
  // 1) Čitanje tokena iz cookie-ja
  const token = (await cookies()).get(AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    // 2) Verifikacija tokena
    const claims = verifyAuthToken(token);

    // 3) U zavisnosti od kind, čitamo iz prave tabele
    if (claims.kind === "KLIJENT") {
      const [u] = await db
        .select({
          id: klijenti.idKlijenta,
          email: klijenti.email,
          ime: klijenti.ime,
          prezime: klijenti.prezime,
          korisnickoIme: klijenti.korisnickoIme,
          brTelefona: klijenti.brTelefona,
          role: klijenti.role,
        })
        .from(klijenti)
        .where(eq(klijenti.idKlijenta, Number(claims.sub)));

      return NextResponse.json({ user: u ?? null });
    }

    // ZAPOSLENI
    const [u] = await db
      .select({
        id: zaposleni.idZaposleni,
        email: zaposleni.email,
        ime: zaposleni.ime,
        prezime: zaposleni.prezime,
        radnoMestoId: zaposleni.radnoMestoId,
        role: zaposleni.role,
      })
      .from(zaposleni)
      .where(eq(zaposleni.idZaposleni, Number(claims.sub)));

    return NextResponse.json({ user: u ?? null });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
