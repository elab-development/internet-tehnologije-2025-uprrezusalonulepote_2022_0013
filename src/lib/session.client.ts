"use client";

import { UserDto } from "@/shared/types";

const LS_USER_KEY = "iteh_mock_user";

// ako hoćeš, dodaj ovde email koji treba da bude ADMIN
const ADMIN_EMAILS = new Set([
  "mina@gmail.com",
  "mina@admin.com",
  "admin@test.com",
]);

export function getMockUser(): UserDto | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(LS_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserDto;
  } catch {
    return null;
  }
}

// kompatibilnost sa kodom koji uvozi getCurrentUserFromStorage
export function getCurrentUserFromStorage(): UserDto | null {
  return getMockUser();
}

export function loginMock(email: string): UserDto {
  const now = new Date().toISOString();
  const e = email.trim().toLowerCase();

  const isAdmin =
    e.includes("admin") || ADMIN_EMAILS.has(e);

  const user: UserDto = isAdmin
    ? {
        id: "u-admin",
        name: "Mina Admin",
        email,
        role: "ADMIN",
        createdAt: now,
      }
    : {
        id: "u-client",
        name: "Ana Klijent",
        email,
        role: "CLIENT",
        createdAt: now,
      };

  window.localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
  return user;
}

export function clearMockUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LS_USER_KEY);
}