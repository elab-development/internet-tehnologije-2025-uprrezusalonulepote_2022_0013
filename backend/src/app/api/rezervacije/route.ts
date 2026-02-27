import { NextRequest, NextResponse } from "next/server";
import {
  getRezervacije,
  createRezervacija,
} from "@/app/controllers/rezervacije/rezervacije.controller";

export async function GET(req: NextRequest) {
  return getRezervacije(req);
}

export async function POST(req: NextRequest) {
  return createRezervacija(req);
}
