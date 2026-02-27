import { NextResponse } from "next/server";
import { getZaposleniWithUsluge } from "@/app/controllers/zaposleni/zaposleni.controller";

export async function GET() {
  try {
    const zaposleni = await getZaposleniWithUsluge();

    // CORS
    return NextResponse.json(zaposleni, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (err) {
    console.error("Greška pri dohvatanju zaposlenih:", err);
    return NextResponse.json(
      { error: "Greška pri dohvatanju zaposlenih" },
      { status: 500 },
    );
  }
}
