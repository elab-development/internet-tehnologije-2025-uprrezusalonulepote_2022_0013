/* import { UserDto } from "@/shared/types";
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
} */
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
  if (USE_MOCK) {
    // password ignorišemo u mocku
    return loginMock(email);
  }

  // backend login ruta treba da vraća UserDto (ne { user: UserDto })
  return apiFetch<UserDto>(endpoints.auth.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function authMe(): Promise<UserDto | null> {
  if (USE_MOCK) return getMockUser();

  // backend /me ruta treba da vraća UserDto (ili 401/404 ako nije ulogovan)
  // apiFetch bi trebalo da baci error na !ok; ako vraća 401, pretvaramo u null
  try {
    return await apiFetch<UserDto>(endpoints.auth.me);
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
  if (USE_MOCK) {
    // u mocku samo “uloguj” tog korisnika
    return loginMock(payload.email);
  }

  // backend register ruta vraća UserDto direktno
  return apiFetch<UserDto>(endpoints.auth.register, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}