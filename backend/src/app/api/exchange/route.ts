import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.EXCHANGE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing EXCHANGE_API_KEY" },
        { status: 500 }
      );
    }

    const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/EUR`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Exchange API request failed" },
        { status: 502 }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      base: "EUR",
      target: "RSD",
      rate: data?.conversion_rates?.RSD ?? null,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch exchange rate" },
      { status: 500 }
    );
  }
}