import { meController } from "@/app/controllers/auth/me.controller";

export const runtime = "nodejs";

export async function GET() {
  return meController();
}
