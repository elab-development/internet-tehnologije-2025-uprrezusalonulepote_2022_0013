import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, verifyAuthToken } from "@/app/lib/auth";

type Role = "KLIJENT" | "ZAPOSLENI" | "ADMIN";

export async function requireAuth(allowedRoles?: Role[]) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;

  if (!token) {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 }),
    };
  }

  try {
    const claims = verifyAuthToken(token);

    if (allowedRoles && !allowedRoles.includes(claims.role as Role)) {
      return {
        ok: false as const,
        res: NextResponse.json({ error: "Nemate dozvolu" }, { status: 403 }),
      };
    }

    return { ok: true as const, claims };
  } catch {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "Nevažeći token" }, { status: 401 }),
    };
  }
}
