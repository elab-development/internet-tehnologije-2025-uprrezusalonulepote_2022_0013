import { db } from "@/app/db";
import { klijenti, zaposleni } from "@/app/db/schema";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/app/lib/auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

console.log("REGISTER HIT");

function sanitizeText(v: unknown, max = 80) {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  if (!trimmed || trimmed.length > max) return null;
  // Minimalna XSS zaštita: uklanjamo tag karaktere
  return trimmed.replace(/[<>]/g, "");
}

function sanitizeEmail(v: unknown) {
  if (typeof v !== "string") return null;
  const e = v.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return null;
  if (e.length > 120) return null;
  return e;
}

function sanitizePhone(v: unknown) {
  if (typeof v !== "string") return null;
  const p = v.trim();
  if (!/^[0-9+ ()-]{6,25}$/.test(p)) return null;
  return p;
}

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

export async function registerController(req: Request) {
  let body: Body;

  try {
    body = (await req.json()) as Body;
    console.log("REGISTER BODY", body);
  } catch {
    return NextResponse.json(
      { error: "Neispravan JSON u body-ju" },
      { status: 400 },
    );
  }

  if (!body?.kind || !body.email || !body.password) {
    return NextResponse.json({ error: "Nedostaju podaci" }, { status: 400 });
  }

  const email = sanitizeEmail(body.email);
  if (!email) {
    return NextResponse.json({ error: "Neispravan email" }, { status: 400 });
  }

  if (typeof body.password !== "string" || body.password.length < 8) {
    return NextResponse.json(
      { error: "Lozinka mora imati najmanje 8 karaktera" },
      { status: 400 },
    );
  }

  const passHash = await bcrypt.hash(body.password, 10);

  if (body.kind === "KLIJENT") {
    const ime = sanitizeText(body.ime, 50);
    const prezime = sanitizeText(body.prezime, 50);
    const brTelefona = sanitizePhone(body.brTelefona);
    const korisnickoIme = sanitizeText(body.korisnickoIme, 30);
    const adresa = body.adresa ? sanitizeText(body.adresa, 120) : undefined;

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

    const usernameExists = await db
      .select({ id: klijenti.idKlijenta })
      .from(klijenti)
      .where(eq(klijenti.korisnickoIme, korisnickoIme));

    if (usernameExists.length) {
      return NextResponse.json(
        { error: "Korisničko ime postoji u bazi" },
        { status: 400 },
      );
    }

    const [u] = await db
      .insert(klijenti)
      .values({
        ime,
        prezime,
        email,
        lozinka: passHash,
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

    const res = NextResponse.json(
      {
        id: u.idKlijenta,
        email: u.email,
        name: `${u.ime} ${u.prezime}`,
        role: u.role,
        kind: "KLIJENT",
      },
      { status: 201 },
    );

    res.cookies.set(AUTH_COOKIE, token, cookieOpts());
    return res;
  }

  const ime = sanitizeText(body.ime, 50);
  const prezime = sanitizeText(body.prezime, 50);
  const radnoMestoId = Number(body.radnoMestoId);

  if (!ime || !prezime || !Number.isFinite(radnoMestoId) || radnoMestoId <= 0) {
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
      lozinka: passHash,
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

  const res = NextResponse.json(
    {
      id: u.idZaposleni,
      email: u.email,
      name: `${u.ime} ${u.prezime}`,
      role: u.role,
      kind: "ZAPOSLENI",
    },
    { status: 201 },
  );

  res.cookies.set(AUTH_COOKIE, token, cookieOpts());
  return res;
}