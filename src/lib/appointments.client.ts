import { BookingDto } from "@/shared/types";
import { apiFetch } from "./api";

export async function getAppointments(): Promise<BookingDto[]> {
  return apiFetch<BookingDto[]>("/api/rezervacije");
}

export type BookingCreateRequest = Omit<BookingDto, "napomena"> & {
  napomena?: string;
};

export async function createAppointment(
  data: BookingCreateRequest,
): Promise<BookingDto> {
  if (!data.zaposleniId || !data.uslugaId) {
    throw new Error("Moraju biti izabrani zaposleni i usluga");
  }

  return apiFetch<BookingDto>("/api/rezervacije", {
    method: "POST",
    body: JSON.stringify({
      datumVreme: data.datumVreme,
      zaposleniId: data.zaposleniId,
      uslugaId: data.uslugaId,
      napomena: data.napomena ?? "",
    }),
  });
}
