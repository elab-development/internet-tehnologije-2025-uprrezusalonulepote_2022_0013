import { UserDto } from "@/shared/types";
import { USE_MOCK } from "@/lib/config";
import { endpoints } from "@/lib/endpoints";
import { apiFetch } from "@/lib/api";
import { clearMockUser, getMockUser, loginMock } from "@/lib/session.client";

type RegisterPayload =
  | {
      kind: "KLIJENT";
      ime: string;
      prezime: string;
      email: string;
      password: string;
      brTelefona: string;
      korisnickoIme: string;
      adresa?: string;
    }
  | {
      kind: "ZAPOSLENI";
      ime: string;
      prezime: string;
      email: string;
      password: string;
      radnoMestoId: number;
      role?: "ADMIN" | "ZAPOSLENI";
    };

export async function authLogin(email: string, password: string): Promise<UserDto> {
  if (USE_MOCK) return loginMock(email);

  const res = await apiFetch<{ user: UserDto }>(endpoints.auth.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return res.user;
}

export async function authMe(): Promise<UserDto | null> {
  if (USE_MOCK) return getMockUser();

  try {
    const res = await apiFetch<{ user: UserDto }>(endpoints.auth.me);
    return res.user;
  } catch {
    return null;
  }
}

export async function authLogout(): Promise<void> {
  if (USE_MOCK) {
    clearMockUser();
    return;
  }

  await apiFetch<{ ok: true }>(endpoints.auth.logout, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
}

export async function authRegister(payload: RegisterPayload): Promise<UserDto> {
  if (USE_MOCK) return loginMock(payload.email);

  const res = await apiFetch<{ user: UserDto }>(endpoints.auth.register, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.user;
}