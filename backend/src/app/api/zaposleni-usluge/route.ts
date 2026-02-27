import { db } from "@/app/db";
import { zaposleniUsluge } from "@/app/db/schema"; // tabela zaposleni_usluge
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { zaposleniId, uslugaId } = body;

    if (!zaposleniId || !uslugaId) {
      return NextResponse.json(
        { error: "Obavezno je zaposleniId i uslugaId" },
        { status: 400 },
      );
    }

    const existing = await db.query.zaposleniUsluge.findFirst({
      where: (z, { eq, and }) =>
        and(eq(z.zaposleniId, zaposleniId), eq(z.uslugaId, uslugaId)),
    });

    if (existing) {
      return NextResponse.json({
        ok: false,
        message: "Usluga je već dodeljena zaposlenom.",
      });
    }

    const [inserted] = await db
      .insert(zaposleniUsluge)
      .values({ zaposleniId, uslugaId })
      .returning({
        zaposleniId: zaposleniUsluge.zaposleniId,
        uslugaId: zaposleniUsluge.uslugaId,
      });

    return NextResponse.json({ ok: true, data: inserted });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Greška pri dodavanju usluge zaposlenom" },
      { status: 500 },
    );
  }
};
