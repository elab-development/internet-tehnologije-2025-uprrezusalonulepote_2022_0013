import { api } from "./http";

export type LoginBody = {
  kind: "KLIJENT" | "ZAPOSLENI";
  email: string;
  password: string;
};
export async function login(body: LoginBody) {
  return api("api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}