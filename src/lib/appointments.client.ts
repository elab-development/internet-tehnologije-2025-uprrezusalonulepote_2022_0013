import { BookingDto, BookingStatus } from "@/shared/types";
import { mockBookings } from "@/mock/data";

// kasnije: USE_MOCK = false
const USE_MOCK = true;

// localStorage key
const LS_KEY = "iteh_bookings_v1";

function hasWindow() {
  return typeof window !== "undefined";
}

function readFromStorage(): BookingDto[] {
  if (!hasWindow()) return mockBookings;

  const raw = window.localStorage.getItem(LS_KEY);
  if (!raw) {
    window.localStorage.setItem(LS_KEY, JSON.stringify(mockBookings));
    return [...mockBookings];
  }

  try {
    const parsed = JSON.parse(raw) as BookingDto[];
    return Array.isArray(parsed) ? parsed : [...mockBookings];
  } catch {
    window.localStorage.setItem(LS_KEY, JSON.stringify(mockBookings));
    return [...mockBookings];
  }
}

function writeToStorage(items: BookingDto[]) {
  if (!hasWindow()) return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export async function getAppointments(): Promise<BookingDto[]> {
  if (USE_MOCK) {
    return Promise.resolve(readFromStorage());
  }
  return [];
}

export async function updateAppointmentStatus(
  id: string,
  status: BookingStatus
): Promise<void> {
  if (USE_MOCK) {
    const items = readFromStorage();
    const idx = items.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error("Rezervacija nije pronađena");

    const next = [...items];
    next[idx] = { ...next[idx], status };

    writeToStorage(next);
    return Promise.resolve();
  }

  throw new Error("Backend nije implementiran");
}

export async function createAppointment(
  data: Omit<BookingDto, "id">
): Promise<BookingDto> {
  if (USE_MOCK) {
    const items = readFromStorage();

    const created: BookingDto = {
      id: Date.now().toString(),
      ...data,
    };

    const next = [created, ...items];
    writeToStorage(next);

    return Promise.resolve(created);
  }

  throw new Error("Backend nije implementiran");
}