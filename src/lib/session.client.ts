import { UserDto } from "@/shared/types";
import { mockUsers } from "@/mock/data";
import { USE_MOCK } from "@/lib/config";

const KEY = "mock_user";

export function getMockUser(): UserDto | null {
  if (!USE_MOCK) return null;
  const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
  return raw ? (JSON.parse(raw) as UserDto) : null;
}

export function setMockUser(user: UserDto) {
  if (!USE_MOCK) return;
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function clearMockUser() {
  if (!USE_MOCK) return;
  localStorage.removeItem(KEY);
}

export function loginMock(email: string) {
  const user = mockUsers.find(u => u.email === email) ?? mockUsers[0];
  setMockUser(user);
  return user;
}