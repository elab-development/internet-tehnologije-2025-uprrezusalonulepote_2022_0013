import { UserDto } from "@/shared/types";
import { USE_MOCK } from "@/lib/config";
import { endpoints } from "@/lib/endpoints";
import { apiFetch } from "@/lib/api";
import { clearMockUser, getMockUser, loginMock } from "@/lib/session.client";

export async function authLogin(email: string, password: string): Promise<UserDto> {
  if (USE_MOCK) {
    // password ignorišemo u mocku
    return loginMock(email);
  }
  const res = await apiFetch<{ user: UserDto }>(endpoints.auth.login, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return res.user;
}

export async function authMe(): Promise<UserDto | null> {
  if (USE_MOCK) return getMockUser();
  const res = await apiFetch<{ user: UserDto }>(endpoints.auth.me);
  return res.user;
}

export async function authLogout(): Promise<void> {
  if (USE_MOCK) {
    clearMockUser();
    return;
  }
  await apiFetch<{ ok: true }>(endpoints.auth.logout, { method: "POST" });
}

export async function authRegister(name: string, email: string, password: string): Promise<UserDto> {
  if (USE_MOCK) {
    // u mocku samo “uloguj” tog korisnika
    return loginMock(email);
  }
  const res = await apiFetch<{ user: UserDto }>(endpoints.auth.register, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  return res.user;
}