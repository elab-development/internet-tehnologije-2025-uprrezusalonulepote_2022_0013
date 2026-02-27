import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { rezervacije, rezervacijaUsluge, usluge } from "@/app/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/app/lib/auth";
import { eq, sql, and } from "drizzle-orm";

export async function getRezervacije(req: NextRequest) {
  try {
    // Dobavi token iz cookie headera
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith(`${AUTH_COOKIE}=`))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ user: null, rezervacije: [] });
    }

    const claims = verifyAuthToken(token);
    const klijentId = Number(claims.sub);

    console.log("Cookie header:", cookieHeader);
    console.log("Token:", token);
    if (token) console.log("Claims:", claims);

    const rows = await db
      .select({
        id: rezervacije.idRezervacije,
        datumVreme: rezervacije.datumVreme,
        napomena: rezervacije.napomena,
        status: rezervacije.status,
        zaposleniId: rezervacije.zaposleniId,
        uslugaId: rezervacijaUsluge.uslugaId,
        uslugaNaziv: usluge.naziv,
      })
      .from(rezervacije)
      .leftJoin(
        rezervacijaUsluge,
        sql`${rezervacijaUsluge.rezervacijaId} = ${rezervacije.idRezervacije}`,
      )
      .leftJoin(usluge, sql`${usluge.idUsluga} = ${rezervacijaUsluge.uslugaId}`)
      .where(eq(rezervacije.klijentId, klijentId));

    console.log("Rezervacije iz DB:", rows);

    return NextResponse.json({
      user: { id: klijentId, kind: claims.kind, name: claims.name },
      rezervacije: rows,
    });
  } catch (error) {
    console.error("Greška pri dohvatanju rezervacija:", error);
    return NextResponse.json({ user: null, rezervacije: [] }, { status: 500 });
  }
}

export async function createRezervacija(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith(`${AUTH_COOKIE}=`))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ message: "Niste ulogovani" }, { status: 401 });
    }

    const claims = verifyAuthToken(token);
    const klijentId = Number(claims.sub);

    const { datumVreme, napomena, zaposleniId, uslugaId } = await req.json();

    if (!uslugaId || !zaposleniId || !datumVreme) {
      return NextResponse.json(
        { message: "Nedostaju obavezni podaci" },
        { status: 400 },
      );
    }

    const startTime = new Date(datumVreme);

    // Provera konflikta zaposlenog
    const existing = await db
      .select({ id: rezervacije.idRezervacije })
      .from(rezervacije)
      .leftJoin(
        rezervacijaUsluge,
        sql`${rezervacijaUsluge.rezervacijaId} = ${rezervacije.idRezervacije}`,
      )
      .where(
        and(
          eq(rezervacije.zaposleniId, zaposleniId),
          eq(rezervacijaUsluge.uslugaId, uslugaId),
          sql`${rezervacije.datumVreme} = ${startTime}`,
        ),
      );

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Zaposleni je već zauzet u tom terminu" },
        { status: 400 },
      );
    }

    // Kreiranje rezervacije
    const [novaRez] = await db
      .insert(rezervacije)
      .values({
        datumVreme: startTime,
        napomena,
        status: "ZAKAZAN",
        zaposleniId,
        klijentId,
      })
      .returning();

    // Vežemo jednu uslugu
    await db.insert(rezervacijaUsluge).values({
      rezervacijaId: novaRez.idRezervacije,
      uslugaId,
    });

    return NextResponse.json(novaRez, { status: 201 });
  } catch (error) {
    console.error("Greška pri kreiranju rezervacije:", error);
    return NextResponse.json(
      { message: "Greška pri kreiranju rezervacije" },
      { status: 500 },
    );
  }
}
