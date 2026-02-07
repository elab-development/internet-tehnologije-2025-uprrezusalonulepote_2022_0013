import { BookingDto, BookingStatus } from "@/shared/types";
import { mockBookings } from "@/mock/data";

// kasnije: USE_MOCK = false
const USE_MOCK = true;

export async function getAppointments(): Promise<BookingDto[]> {
  if (USE_MOCK) {
    return Promise.resolve(mockBookings);
  }
  return [];
}

export async function updateAppointmentStatus(
  id: string,
  status: BookingStatus
): Promise<void> {
  if (USE_MOCK) {
    const idx = mockBookings.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error("Rezervacija nije pronađena");

    mockBookings[idx] = {
      ...mockBookings[idx],
      status,
    };

    return Promise.resolve();
  }

  throw new Error("Backend nije implementiran");
}