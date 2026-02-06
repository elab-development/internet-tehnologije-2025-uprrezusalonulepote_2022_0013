import "dotenv/config";
import { db } from "./index";
import {
  radnaMesta,
  zaposleni,
  klijenti,
  usluge,
  zaposleniUsluge,
  rezervacije,
  rezervacijaUsluge,
  radneSmene,
} from "./schema";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

async function seed() {
  console.log("🌱 Seeding started...");

  // 1️⃣ Radna mesta
  const [frizer, kozmeticar] = await db
    .insert(radnaMesta)
    .values([{ naziv: "Frizer" }, { naziv: "Kozmetičar" }])
    .returning();

  // 2️⃣ Usluge
  const [sisanje, feniranje, manikir] = await db
    .insert(usluge)
    .values([
      { naziv: "Šišanje" },
      { naziv: "Feniranje" },
      { naziv: "Manikir" },
    ])
    .returning();

  // 3️⃣ Zaposleni
  const [ana, milan] = await db
    .insert(zaposleni)
    .values([
      {
        ime: "Ana",
        prezime: "Petrović",
        email: "ana@salon.rs",
        lozinka: "hashed_lozinka",
        radnoMestoId: frizer.idRadnogMesta,
      },
      {
        ime: "Milan",
        prezime: "Jovanović",
        email: "milan@salon.rs",
        lozinka: "hashed_lozinka",
        radnoMestoId: kozmeticar.idRadnogMesta,
      },
    ])
    .returning();

  // 4️⃣ Zaposleni ↔ Usluge
  await db.insert(zaposleniUsluge).values([
    { zaposleniId: ana.idZaposleni, uslugaId: sisanje.idUsluga },
    { zaposleniId: ana.idZaposleni, uslugaId: feniranje.idUsluga },
    { zaposleniId: milan.idZaposleni, uslugaId: manikir.idUsluga },
  ]);

  // 5️⃣ Klijenti
  const [sara] = await db
    .insert(klijenti)
    .values([
      {
        ime: "Sara",
        prezime: "Ratkovic",
        email: "sara@gmail.com",
        lozinka: "hashed_lozinka",
        brTelefona: "0611234567",
        adresa: "Beograd",
        korisnickoIme: "sara123",
      },
    ])
    .returning();

  // 6️⃣ Rezervacija
  const [rez] = await db
    .insert(rezervacije)
    .values([
      {
        datumVreme: new Date("2026-03-01T12:00:00"),
        status: "confirmed",
        napomena: "Prvi termin",
        klijentId: sara.idKlijenta,
        zaposleniId: ana.idZaposleni,
      },
    ])
    .returning();

  // 7️⃣ Rezervacija ↔ Usluge (više usluga)
  await db.insert(rezervacijaUsluge).values([
    { rezervacijaId: rez.idRezervacije, uslugaId: sisanje.idUsluga },
    { rezervacijaId: rez.idRezervacije, uslugaId: feniranje.idUsluga },
  ]);

  // 8️⃣ Radna smena
  await db.insert(radneSmene).values([
    {
      datum: "2026-03-01",
      pocetakSmene: "08:00",
      krajSmene: "16:00",
      zaposleniId: ana.idZaposleni,
    },
  ]);

  console.log("✅ Seeding finished");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
