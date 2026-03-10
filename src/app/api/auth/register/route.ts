import { registerController } from "@/app/controllers/auth/register.controller";

export const runtime = "nodejs";

export async function POST(req: Request) {
  return registerController(req);
}
