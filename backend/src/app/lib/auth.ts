import * as jwt from "jsonwebtoken";

export const AUTH_COOKIE = "auth"; //kreiramo cookie u kome cemo smestiti token
const JWT_SECRET = process.env.JWT_SECRET!; // citamo secret iz env fajla

//error handling
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in env file");
}

//definisemo kako ce izgledati token
export type JwtUserClaims = {
  sub: string; //subject - standardno za JWT, obicno neki id
  email: string;
  name?: string;
  role: "ADMIN" | "ZAPOSLENI" | "KLIJENT";
  kind: "ZAPOSLENI" | "KLIJENT";
};

// kreiramo token, ovu fju zovemo prilikom uspesnog logina
// vraca string koji cemo smestiti u AUTH_TOKEN
// koristimo HS256 algoritam, bitno je da simetrican, koristimo isti secret da ga posle verifikujemo
export function signAuthToken(claims: JwtUserClaims) {
  return jwt.sign(claims, JWT_SECRET, { algorithm: "HS256", expiresIn: "7d" });
}

// verifikujemo token, verify() vraca string pa ga pakujemo u JwtUserClaims
// i posle uspesne verifikacije, ne znamo da li je vratio sve podatke pa proveravamo da li ima obavezne claim-ove
export function verifyAuthToken(token: string): JwtUserClaims {
  const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload &
    JwtUserClaims;

  if (
    !payload ||
    typeof payload.sub !== "string" ||
    typeof payload.email !== "string" ||
    (payload.role !== "ADMIN" &&
      payload.role !== "ZAPOSLENI" &&
      payload.role !== "KLIJENT") ||
    (payload.kind !== "ZAPOSLENI" && payload.kind !== "KLIJENT")
  ) {
    throw new Error("Invalid token");
  }

  return {
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
    kind: payload.kind,
    name: payload.name,
  };
}

export function cookieOpts() {
  return {
    httpOnly: true, // ne moze se pristupiti kroz JS, zastita od XSS napada// ne moze
    sameSite: "lax" as const, // ogranicava pristup na normalnu navigaciju kroz isti sajt, stiti od CSRF
    secure: process.env.NODE_ENV === "production", // na produkciji salje token samo kroz HTTPS
    path: "/", // dostupan na svim rutama
    maxAge: 60 * 60 * 24 * 7,
  };
}
