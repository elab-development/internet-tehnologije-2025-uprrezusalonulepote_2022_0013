import { db } from "@/app/db";
import { zaposleni } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await ctx.params;
  const id = Number(idParam);

  try {
    const deleted = await db
      .delete(zaposleni)
      .where(eq(zaposleni.idZaposleni, id))
      .returning({ id: zaposleni.idZaposleni });

    if (!deleted.length) {
      return NextResponse.json(
        { error: "Zaposleni nije pronađen" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, id });
  } catch (e: any) {
    if (e?.cause?.code === "23503") {
      return NextResponse.json(
        { error: "Zaposleni ima zakazane rezervacije i ne može biti obrisan" },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}
