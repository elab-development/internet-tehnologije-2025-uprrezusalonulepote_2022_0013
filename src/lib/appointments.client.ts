import { BookingDto } from "@/shared/types";
import { mockBookings } from "@/mock/data";

const USE_MOCK = true;

export async function getAppointments(): Promise<BookingDto[]> {
  if (USE_MOCK) return mockBookings;
  return [];
}