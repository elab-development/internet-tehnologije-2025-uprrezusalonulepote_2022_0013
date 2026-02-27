import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/app/db";
import { usluge } from "@/app/db/schema";

export const runtime = "nodejs";

export interface EmployeeShortDto {
  id: number;
  fullName: string;
}

export interface ServiceDto {
  id: number;
  name: string;
  priceRsd: number;
  durationMin: number;
  employees: EmployeeShortDto[];
}

function mapToServiceDto(s: any): ServiceDto {
  return {
    id: s.idUsluga,
    name: s.naziv,
    priceRsd: s.cena,
    durationMin: s.trajanje,
    employees: [],
  };
}

/**
 * GET /api/usluge/:id
 */
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await ctx.params;
  const id = Number(idParam);

  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Neispravan id" }, { status: 400 });
  }

  try {
    const result = await db
      .select()
      .from(usluge)
      .where(sql`id_usluga = ${id}`)
      .limit(1);

    if (!result.length) {
      return NextResponse.json(
        { error: "Usluga nije pronađena" },
        { status: 404 },
      );
    }

    return NextResponse.json<ServiceDto>(mapToServiceDto(result[0]));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}

/**
 * PUT /api/usluge/:id
 */
export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await ctx.params;
  const id = Number(idParam);

  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Neispravan id" }, { status: 400 });
  }

  try {
    type UpdateServiceInput = Omit<ServiceDto, "id" | "employees">;

    const body: UpdateServiceInput = await req.json();

    if (
      !body.name ||
      !Number.isFinite(body.priceRsd) ||
      !Number.isFinite(body.durationMin)
    ) {
      return NextResponse.json({ error: "Neispravni podaci" }, { status: 400 });
    }

    const [updated] = await db
      .update(usluge)
      .set({
        naziv: body.name,
        cena: body.priceRsd,
        trajanje: body.durationMin,
      })
      .where(sql`id_usluga = ${id}`)
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Usluga nije pronađena" },
        { status: 404 },
      );
    }

    return NextResponse.json<ServiceDto>(mapToServiceDto(updated));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}

/**
 * DELETE /api/usluge/:id
 */
export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await ctx.params;
  const id = Number(idParam);

  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Neispravan id" }, { status: 400 });
  }

  try {
    const deleted = await db
      .delete(usluge)
      .where(sql`id_usluga = ${id}`)
      .returning();

    if (!deleted.length) {
      return NextResponse.json(
        { error: "Usluga nije pronađena" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}
