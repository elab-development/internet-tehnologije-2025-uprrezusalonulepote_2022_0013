import { db } from "@/app/db";
import { zaposleni } from "@/app/db/schema";
import { NextResponse } from "next/server";

/**
 * @openapi
 * /api/zaposleni:
 *   get:
 *     summary: Get list of employees
 *     tags:
 *       - Zaposleni
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 zaposleni:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 1
 *                       ime:
 *                         type: string
 *                         example: Ana
 *                       prezime:
 *                         type: string
 *                         example: Petrović
 *                       email:
 *                         type: string
 *                         example: ana@example.com
 *                       role:
 *                         type: string
 *                         example: ADMIN
 *                       radnoMestoId:
 *                         type: number
 *                         example: 2
 */

export const runtime = "nodejs";

export async function GET() {
  const list = await db
    .select({
      id: zaposleni.idZaposleni,
      ime: zaposleni.ime,
      prezime: zaposleni.prezime,
      email: zaposleni.email,
      role: zaposleni.role,
      radnoMestoId: zaposleni.radnoMestoId,
    })
    .from(zaposleni);

  return NextResponse.json({ zaposleni: list });
}
