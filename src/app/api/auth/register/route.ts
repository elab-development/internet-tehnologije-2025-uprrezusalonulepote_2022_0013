import { db } from "@/app/db";
import { klijenti, zaposleni } from "@/app/db/schema";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/app/lib/auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Body =
  | {
      kind: "KLIJENT";
      ime: string;
      prezime: string;
      email: string;
      password: string;
      brTelefona: string;
      korisnickoIme: string;
      adresa?: string;
    }
  | {
      kind: "ZAPOSLENI";
      ime: string;
      prezime: string;
      email: string;
      password: string;
      radnoMestoId: number;
      role?: "ADMIN" | "ZAPOSLENI";
    };

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Body;

  // 1) Procitaj body SAMO JEDNOM
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json(
      { error: "Neispravan JSON u body-ju" },
      { status: 400 },
    );
  }

  // 2) Osnovna validacija zajednickih polja
  if (!body?.kind || !body.email || !body.password) {
    return NextResponse.json({ error: "Nedostaju podaci" }, { status: 400 });
  }

  if (typeof body.password !== "string" || body.password.length < 8) {
    return NextResponse.json(
      { error: "Lozinka mora imati najmanje 8 karaktera" },
      { status: 400 },
    );
  }

  const passHash = await bcrypt.hash(body.password, 10);

  // 3) Registracija KLIJENTA
  if (body.kind === "KLIJENT") {
    const { ime, prezime, email, brTelefona, korisnickoIme, adresa } = body;

    if (!ime || !prezime || !brTelefona || !korisnickoIme) {
      return NextResponse.json({ error: "Nedostaju podaci" }, { status: 400 });
    }

    const exists = await db
      .select({ id: klijenti.idKlijenta })
      .from(klijenti)
      .where(eq(klijenti.email, email));

    if (exists.length) {
      return NextResponse.json(
        { error: "Email postoji u bazi" },
        { status: 400 },
      );
    }

    const [u] = await db
      .insert(klijenti)
      .values({
        ime,
        prezime,
        email,
        lozinka: passHash, // password -> lozinka (OK)
        brTelefona,
        korisnickoIme,
        adresa,
        role: "KLIJENT",
      })
      .returning();

    const token = signAuthToken({
      sub: String(u.idKlijenta),
      email: u.email,
      name: `${u.ime} ${u.prezime}`,
      role: u.role as "ADMIN" | "ZAPOSLENI" | "KLIJENT",
      kind: "KLIJENT",
    });

    const res = NextResponse.json({
      id: u.idKlijenta,
      email: u.email,
      name: `${u.ime} ${u.prezime}`,
      role: u.role,
      kind: "KLIJENT",
    });

    res.cookies.set(AUTH_COOKIE, token, cookieOpts());
    return res;
  }

  // 4) Registracija ZAPOSLENOG
  // (body.kind === "ZAPOSLENI")
  const { ime, prezime, email, radnoMestoId } = body;

  if (!ime || !prezime || !radnoMestoId) {
    return NextResponse.json({ error: "Nedostaju podaci" }, { status: 400 });
  }

  const exists = await db
    .select({ id: zaposleni.idZaposleni })
    .from(zaposleni)
    .where(eq(zaposleni.email, email));

  if (exists.length) {
    return NextResponse.json(
      { error: "Email postoji u bazi" },
      { status: 400 },
    );
  }

  const [u] = await db
    .insert(zaposleni)
    .values({
      ime,
      prezime,
      email,
      lozinka: passHash, // password -> lozinka (OK)
      radnoMestoId,
      role: body.role ?? "ZAPOSLENI",
    })
    .returning();

  const token = signAuthToken({
    sub: String(u.idZaposleni),
    email: u.email,
    name: `${u.ime} ${u.prezime}`,
    role: u.role as "ADMIN" | "ZAPOSLENI" | "KLIJENT",
    kind: "ZAPOSLENI",
  });

  const res = NextResponse.json({
    id: u.idZaposleni,
    email: u.email,
    name: `${u.ime} ${u.prezime}`,
    role: u.role,
    kind: "ZAPOSLENI",
  });

  res.cookies.set(AUTH_COOKIE, token, cookieOpts());
  return res;
}
