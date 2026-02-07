import { db } from "@/app/db";
import { klijenti, zaposleni } from "@/app/db/schema";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/app/lib/auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Body = {
  email: string;
  password: string;
  kind: "KLIJENT" | "ZAPOSLENI";
};

export async function loginController(req: Request) {
  const { email, password, kind } = (await req.json()) as Body;

  if (!email || !password || !kind) {
    return NextResponse.json(
      { error: "Pogrešan email ili lozinka" },
      { status: 401 },
    );
  }

  if (kind === "KLIJENT") {
    const [u] = await db
      .select()
      .from(klijenti)
      .where(eq(klijenti.email, email));

    if (!u || !(await bcrypt.compare(password, u.lozinka))) {
      return NextResponse.json(
        { error: "Pogrešan email ili lozinka" },
        { status: 401 },
      );
    }

    const token = signAuthToken({
      sub: String(u.idKlijenta),
      email: u.email,
      name: `${u.ime} ${u.prezime}`,
      role: u.role,
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

  const [u] = await db
    .select()
    .from(zaposleni)
    .where(eq(zaposleni.email, email));

  if (!u || !(await bcrypt.compare(password, u.lozinka))) {
    return NextResponse.json(
      { error: "Pogrešan email ili lozinka" },
      { status: 401 },
    );
  }

  const token = signAuthToken({
    sub: String(u.idZaposleni),
    email: u.email,
    name: `${u.ime} ${u.prezime}`,
    role: u.role,
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
