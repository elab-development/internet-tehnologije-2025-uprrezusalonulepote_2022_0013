import { loginController } from "@/app/controllers/auth/login.controller";

export async function POST(req: Request) {
  return loginController(req);
}
