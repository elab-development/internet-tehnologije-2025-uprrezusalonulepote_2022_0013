import { NextRequest, NextResponse } from "next/server";
import {
  getAllUsluge,
  createUsluga,
} from "@/app/controllers/usluge/usluge.controller";

// OPTIONS preflight
export async function OPTIONS() {
  const res = new Response(null, { status: 204 });
  res.headers.set("Access-Control-Allow-Origin", "*"); // dozvoli frontend origin
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS",
  );
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

// GET: vrati sve usluge
export async function GET(req: NextRequest) {
  const res = await getAllUsluge();
  // Dodaj CORS header na odgovor
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}

// POST: kreiraj novu uslugu
export async function POST(req: NextRequest) {
  const res = await createUsluga(req);
  // Dodaj CORS header
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}
