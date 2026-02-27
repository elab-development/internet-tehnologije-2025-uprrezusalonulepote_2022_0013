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
  const auth = await requireAuth(["ADMIN"]); // samo admin moze da brise zaposlenog
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

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(["ADMIN"]);
  if (!auth.ok) return auth.res;

  const { id: idParam } = await ctx.params;
  const id = Number(idParam);

  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Neispravan id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { name, email, jobTitle, role } = body;

    if (!name || !email || !jobTitle || !role) {
      return NextResponse.json(
        { error: "Obavezna polja: name, email, jobTitle, role" },
        { status: 400 },
      );
    }

    // razdvoj ime i prezime
    const [ime, ...prezimeParts] = name.split(" ");
    const prezime = prezimeParts.join(" ") || "";

    // mapiranje jobTitle → radnoMestoId
    const radnoMestoId = mapJobTitleToRadnoMestoId(jobTitle);

    const [updated] = await db
      .update(zaposleni)
      .set({
        ime,
        prezime,
        email,
        role,
        radnoMestoId,
      })
      .where(eq(zaposleni.idZaposleni, id))
      .returning({
        id: zaposleni.idZaposleni,
        ime: zaposleni.ime,
        prezime: zaposleni.prezime,
        email: zaposleni.email,
        role: zaposleni.role,
        radnoMestoId: zaposleni.radnoMestoId,
      });

    if (!updated) {
      return NextResponse.json(
        { error: "Zaposleni nije pronađen" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      employee: {
        id: updated.id.toString(),
        name: `${updated.ime} ${updated.prezime}`,
        email: updated.email,
        jobTitle: mapRadnoMestoIdToJobTitle(updated.radnoMestoId),
        role: updated.role,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}

/**
 * Mapira jobTitle → radnoMestoId
 */
function mapJobTitleToRadnoMestoId(
  jobTitle: "FRIZER" | "SMINKER" | "KOZMETICAR",
) {
  switch (jobTitle) {
    case "FRIZER":
      return 1;
    case "KOZMETICAR":
      return 3;
    case "SMINKER":
      return 2;
    default:
      return 1;
  }
}

/**
 * Mapira radnoMestoId → jobTitle
 */
function mapRadnoMestoIdToJobTitle(id: number) {
  switch (id) {
    case 1:
      return "FRIZER";
    case 2:
      return "SMINKER";
    case 3:
      return "KOZMETICAR";
    default:
      return "Zaposlenom nisu registrovane usluge";
  }
}
