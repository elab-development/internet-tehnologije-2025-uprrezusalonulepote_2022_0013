import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
  date,
  time,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";

// 1) Radno mesto
export const radnaMesta = pgTable("radna_mesta", {
  idRadnogMesta: serial("id_radnog_mesta").primaryKey(),
  naziv: varchar("naziv", { length: 100 }).notNull(),
});

// 2) Zaposleni (svaki zaposleni ima 1 radno mesto)
export const zaposleni = pgTable(
  "zaposleni",
  {
    idZaposleni: serial("id_zaposleni").primaryKey(),
    ime: varchar("ime", { length: 60 }).notNull(),
    prezime: varchar("prezime", { length: 60 }).notNull(),
    email: varchar("email", { length: 120 }).notNull(),
    lozinka: varchar("lozinka", { length: 255 }).notNull(),
    radnoMestoId: integer("radno_mesto_id")
      .notNull()
      .references(() => radnaMesta.idRadnogMesta, { onDelete: "restrict" }),
  },
  (t) => ({
    zaposleniEmailUq: uniqueIndex("zaposleni_email_uq").on(t.email),
  }),
);

// 3) Klijent
export const klijenti = pgTable(
  "klijenti",
  {
    idKlijenta: serial("id_klijenta").primaryKey(),
    ime: varchar("ime", { length: 60 }).notNull(),
    prezime: varchar("prezime", { length: 60 }).notNull(),
    email: varchar("email", { length: 120 }).notNull(),
    lozinka: varchar("lozinka", { length: 255 }).notNull(),
    brTelefona: varchar("br_telefona", { length: 30 }).notNull(),
    adresa: varchar("adresa", { length: 255 }),
    korisnickoIme: varchar("korisnicko_ime", { length: 60 }).notNull(),
  },
  (t) => ({
    klijentiEmailUq: uniqueIndex("klijenti_email_uq").on(t.email),
    klijentiUsernameUq: uniqueIndex("klijenti_korisnickoime_uq").on(
      t.korisnickoIme,
    ),
  }),
);

// 4) Usluga
export const usluge = pgTable("usluge", {
  idUsluga: serial("id_usluga").primaryKey(),
  naziv: varchar("naziv", { length: 120 }).notNull(),
});

// 5) Many-to-many: Zaposleni <-> Usluga
export const zaposleniUsluge = pgTable(
  "zaposleni_usluge",
  {
    zaposleniId: integer("zaposleni_id")
      .notNull()
      .references(() => zaposleni.idZaposleni, { onDelete: "cascade" }),
    uslugaId: integer("usluga_id")
      .notNull()
      .references(() => usluge.idUsluga, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.zaposleniId, t.uslugaId] }),
  }),
);

// 6) Rezervacija (1 klijent, 1 zaposleni) + više usluga preko spojne tabele
export const rezervacije = pgTable("rezervacije", {
  idRezervacije: serial("id_rezervacije").primaryKey(),
  datumVreme: timestamp("datum_vreme", { withTimezone: false }).notNull(),
  napomena: text("napomena"),
  status: varchar("status", { length: 30 }).notNull(), // npr: pending/confirmed/canceled
  klijentId: integer("klijent_id")
    .notNull()
    .references(() => klijenti.idKlijenta, { onDelete: "cascade" }),
  zaposleniId: integer("zaposleni_id")
    .notNull()
    .references(() => zaposleni.idZaposleni, { onDelete: "restrict" }),
});

// 6b) Rezervacija <-> Usluga
export const rezervacijaUsluge = pgTable(
  "rezervacija_usluge",
  {
    rezervacijaId: integer("rezervacija_id")
      .notNull()
      .references(() => rezervacije.idRezervacije, { onDelete: "cascade" }),
    uslugaId: integer("usluga_id")
      .notNull()
      .references(() => usluge.idUsluga, { onDelete: "restrict" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.rezervacijaId, t.uslugaId] }),
  }),
);

// 7) Radna smena (svaka smena pripada 1 zaposlenom)
export const radneSmene = pgTable("radne_smene", {
  idSmene: serial("id_smene").primaryKey(),
  datum: date("datum").notNull(),
  pocetakSmene: time("pocetak_smene").notNull(),
  krajSmene: time("kraj_smene").notNull(),
  zaposleniId: integer("zaposleni_id")
    .notNull()
    .references(() => zaposleni.idZaposleni, { onDelete: "cascade" }),
});
