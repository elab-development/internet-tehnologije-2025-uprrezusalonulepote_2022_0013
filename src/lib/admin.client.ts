import { UserDto } from "@/shared/types";
import { mockUsers } from "@/mock/data";

const USE_MOCK = true;

export async function getAllUsers(): Promise<UserDto[]> {
  if (USE_MOCK) return mockUsers;
  return [];
}