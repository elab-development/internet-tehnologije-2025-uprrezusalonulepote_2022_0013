import { db } from "@/app/db";
import { zaposleni, zaposleniUsluge, usluge } from "@/app/db/schema";
import { sql } from "drizzle-orm";

// Funkcija koja vraća zaposlene sa uslugama
export async function getZaposleniWithUsluge() {
  const rows = await db
    .select({
      zaposleniId: zaposleni.idZaposleni,
      ime: zaposleni.ime,
      prezime: zaposleni.prezime,
      email: zaposleni.email,
      role: zaposleni.role,
      radnoMestoId: zaposleni.radnoMestoId,
      uslugaId: usluge.idUsluga,
      nazivUsluge: usluge.naziv,
      cenaUsluge: usluge.cena,
      trajanjeUsluge: usluge.trajanje,
    })
    .from(zaposleni)
    .leftJoin(
      zaposleniUsluge,
      sql`${zaposleni.idZaposleni} = ${zaposleniUsluge.zaposleniId}`,
    )
    .leftJoin(usluge, sql`${usluge.idUsluga} = ${zaposleniUsluge.uslugaId}`);

  // Grupisanje po zaposlenom
  const map = new Map<number, any>();
  for (const row of rows) {
    if (!map.has(row.zaposleniId)) {
      map.set(row.zaposleniId, {
        id: row.zaposleniId,
        ime: row.ime,
        prezime: row.prezime,
        email: row.email,
        role: row.role,
        radnoMestoId: row.radnoMestoId,
        usluge: [],
      });
    }

    if (row.uslugaId !== null && row.uslugaId !== undefined) {
      map.get(row.zaposleniId).usluge.push({
        id: row.uslugaId,
        naziv: row.nazivUsluge,
        cena: row.cenaUsluge,
        trajanje: row.trajanjeUsluge,
      });
    }
  }

  return Array.from(map.values());
}
