import { BookingDto } from "@/shared/types";
import { mockBookings } from "@/mock/data";

const USE_MOCK = true;

export async function getAppointments(): Promise<BookingDto[]> {
  if (USE_MOCK) return mockBookings;
  return [];
}

export type CreateBookingInput = {
  date: string;
  startTime: string;
  endTime: string;
  serviceName: string;
  employeeName: string;
};

export async function createAppointment(input: CreateBookingInput): Promise<BookingDto> {
  if (USE_MOCK) {
    const newBooking: BookingDto = {
      id: "b" + (mockBookings.length + 1),
      status: "ZAKAZANO",
      ...input,
    };
    mockBookings.unshift(newBooking);
    return newBooking;
  }

  // placeholder za backend
  return {
    id: "server",
    status: "ZAKAZANO",
    ...input,
  };
}