import { db } from "@/app/db";
import { usluge, zaposleni, zaposleniUsluge } from "@/app/db/schema";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

// GET: vraća sve usluge sa zaposlenima
export async function getAllUsluge() {
  try {
    const rows = await db
      .select({
        uslugaId: usluge.idUsluga,
        naziv: usluge.naziv,
        cena: usluge.cena,
        trajanje: usluge.trajanje,
        zaposleniId: zaposleni.idZaposleni,
        ime: zaposleni.ime,
        prezime: zaposleni.prezime,
      })
      .from(usluge)
      .leftJoin(
        zaposleniUsluge,
        sql`${usluge.idUsluga} = ${zaposleniUsluge.uslugaId}`,
      )
      .leftJoin(
        zaposleni,
        sql`${zaposleni.idZaposleni} = ${zaposleniUsluge.zaposleniId}`,
      );

    // Grupisanje po usluzi
    const map = new Map<number, any>();

    for (const row of rows) {
      if (!map.has(row.uslugaId)) {
        map.set(row.uslugaId, {
          id: row.uslugaId,
          name: row.naziv,
          priceRsd: row.cena,
          durationMin: row.trajanje,
          employees: [],
        });
      }

      if (row.zaposleniId !== null && row.zaposleniId !== undefined) {
        map.get(row.uslugaId).employees.push({
          id: row.zaposleniId,
          fullName: `${row.ime} ${row.prezime}`,
        });
      }
    }
    console.log("ROWS FROM DB:", rows);

    return NextResponse.json(Array.from(map.values()));
  } catch (error) {
    console.error("Greška pri dohvatanju usluga:", error);
    return NextResponse.json({ message: "Greška na serveru" }, { status: 500 });
  }
}

// POST: kreira novu uslugu
export async function createUsluga(req: Request) {
  try {
    const { name, priceRsd, durationMin } = await req.json();

    if (!name || !priceRsd || !durationMin) {
      return NextResponse.json(
        { message: "Naziv, cena i trajanje su obavezni" },
        { status: 400 },
      );
    }

    const [novaUsluga] = await db
      .insert(usluge)
      .values({
        naziv: name,
        cena: priceRsd,
        trajanje: durationMin,
      })
      .returning();

    return NextResponse.json(
      {
        id: novaUsluga.idUsluga,
        name: novaUsluga.naziv,
        priceRsd: novaUsluga.cena,
        durationMin: novaUsluga.trajanje,
        employees: [],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Greška pri kreiranju usluge:", error);
    return NextResponse.json(
      { message: "Greška pri kreiranju usluge" },
      { status: 500 },
    );
  }
}

// PUT: ažurira uslugu
export async function updateUsluga(req: Request, params: { id: string }) {
  try {
    const { name, priceRsd, durationMin } = await req.json();

    if (!name || !priceRsd || !durationMin) {
      return NextResponse.json(
        { message: "Naziv, cena i trajanje su obavezni" },
        { status: 400 },
      );
    }

    const [updated] = await db
      .update(usluge)
      .set({
        naziv: name,
        cena: priceRsd,
        trajanje: durationMin,
      })
      .where(sql`id_usluga = ${Number(params.id)}`)
      .returning();

    if (!updated) {
      return NextResponse.json(
        { message: "Usluga nije pronađena" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: updated.idUsluga,
      name: updated.naziv,
      priceRsd: updated.cena,
      durationMin: updated.trajanje,
      employees: [],
    });
  } catch (error) {
    console.error("Greška pri ažuriranju:", error);
    return NextResponse.json(
      { message: "Greška pri ažuriranju usluge" },
      { status: 500 },
    );
  }
}

// DELETE: briše uslugu
export async function deleteUsluga(params: { id: string }) {
  try {
    await db.delete(usluge).where(sql`id_usluga = ${Number(params.id)}`);
    return NextResponse.json({ message: "Usluga obrisana" });
  } catch (error) {
    console.error("Greška pri brisanju:", error);
    return NextResponse.json(
      { message: "Greška pri brisanju usluge" },
      { status: 500 },
    );
  }
}
