import { UserDto } from "@/shared/types";

const USER_KEY = "iteh_user_v1";

/**
 * Mock login – kreira usera, snima ga u localStorage i vraća ga
 */
export function loginMock(email: string, name?: string): UserDto {
  const user: UserDto = {
    id: email, // stabilan id; može i crypto.randomUUID()
    name: name ?? email.split("@")[0],
    email,
    role: "CLIENT", // promeni ako ti UserDto nema role ili koristi drugo polje
  } as UserDto;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  return user;
}

/**
 * Dohvata trenutno ulogovanog mock usera
 */
export function getMockUser(): UserDto | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserDto;
  } catch {
    return null;
  }
}

/**
 * Logout – briše usera iz storage-a
 */
export function clearMockUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(USER_KEY);
}

/**
 * NOVO – koristi se za filtriranje rezervacija (A2)
 */
export function getCurrentUserFromStorage() {
  return getMockUser();
}