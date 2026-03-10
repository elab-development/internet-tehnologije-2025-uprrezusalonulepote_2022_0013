import { logoutController } from "@/app/controllers/auth/logout.controller";

export async function POST() {
  return logoutController();
}
