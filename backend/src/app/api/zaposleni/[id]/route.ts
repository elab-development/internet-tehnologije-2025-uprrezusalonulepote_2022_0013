import { db } from "@/app/db";
import { zaposleni } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAuth } from "@/app/lib/guards";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(["ADMIN"]); //samo admin moze da brise zaposlenog
  if (!auth.ok) return auth.res;

  const { id: idParam } = await ctx.params;
  const id = Number(idParam);

  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Neispravan id" }, { status: 400 });
  }

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
