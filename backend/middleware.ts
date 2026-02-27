import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedOrigins = ["http://localhost:3000"];

export function middleware(req: NextRequest) {
  console.log("***************MIDDLEWARE LOADED***************");
  const origin = req.headers.get("origin") ?? "";

  if (!allowedOrigins.includes(origin)) {
    return NextResponse.next();
  }

  // Ako je preflight, vrati odmah 204 sa CORS headerima
  if (req.method === "OPTIONS") {
    const preflight = new NextResponse(null, { status: 204 });
    preflight.headers.set("Access-Control-Allow-Origin", origin);
    preflight.headers.set(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS",
    );
    preflight.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    preflight.headers.set("Access-Control-Allow-Credentials", "true");
    preflight.headers.set("Vary", "Origin");
    return preflight;
  }

  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS",
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Vary", "Origin");
  return res;
}

export const config = {
  matcher: "/api/:path*",
};
