import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ORIGIN = "http://localhost:3000";

export function middleware(req: NextRequest) {

console.log("MIDDLEWARE LOADED");

  // Ako je preflight, vrati odmah 204 sa CORS headerima
  if (req.method === "OPTIONS") {
    const preflight = new NextResponse(null, { status: 204 });
    preflight.headers.set("Access-Control-Allow-Origin", ORIGIN);
    preflight.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    preflight.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    preflight.headers.set("Access-Control-Allow-Credentials", "true");
    preflight.headers.set("Vary", "Origin");
    return preflight;
  }

  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", ORIGIN);
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Vary", "Origin");
  return res;
}

export const config = {
  matcher: "/api/:path*",
};
