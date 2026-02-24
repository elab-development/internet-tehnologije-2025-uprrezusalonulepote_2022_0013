import { registerController } from "@/app/controllers/auth/register.controller";

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Validation error
 */

export const runtime = "nodejs";

export async function POST(req: Request) {
  return registerController(req);
}
