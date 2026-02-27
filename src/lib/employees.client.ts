import { EmployeeDto, ServiceDto, ShiftDto } from "@/shared/types";
import { apiFetch } from "./api";

/**
 * Mapira radno mesto ID u jobTitle
 */
function mapRadnoMestoIdToJobTitle(id: number): EmployeeDto["jobTitle"] {
  switch (id) {
    case 1:
      return "FRIZER";
    case 2:
      return "KOZMETICAR";
    case 3:
      return "SMINKER";
    default:
      return "Nema usluge";
  }
}

/**
 * Dohvata sve zaposlene
 */
export async function getAllEmployeesFromApi(): Promise<EmployeeDto[]> {
  try {
    const data = await apiFetch<any[]>("/api/zaposleni");

    return data.map((e) => ({
      id: e.id.toString(),
      name: `${e.ime} ${e.prezime}`,
      email: e.email,
      jobTitle: mapRadnoMestoIdToJobTitle(e.radnoMestoId),
      role: e.role,
    }));
  } catch (err) {
    console.error("Greška pri dohvatanju zaposlenih:", err);
    return [];
  }
}

/**
 * Dohvata usluge po zaposlenom
 */
export async function getEmployeeServicesMapFromApi(): Promise<
  Record<string, ServiceDto[]>
> {
  try {
    const data = await apiFetch<any[]>("/api/zaposleni");
    const map: Record<string, ServiceDto[]> = {};

    for (const e of data) {
      map[e.id.toString()] =
        e.usluge?.map((u: any) => ({
          id: u.id,
          name: u.naziv,
          priceRsd: u.cena ?? 0,
          durationMin: u.trajanje ?? 0,
          employees: [],
        })) ?? [];
    }

    return map;
  } catch (err) {
    console.error("Greška pri dohvatanju usluga zaposlenih:", err);
    return {};
  }
}

/**
 * Dohvata smene po zaposlenom
 */
export async function getEmployeeShiftsMap(): Promise<
  Record<string, ShiftDto[]>
> {
  try {
    const map = await apiFetch<Record<string, ShiftDto[]>>("/api/radne-smene");
    return map;
  } catch (err) {
    console.error("Greška pri dohvatanju smena zaposlenih:", err);
    return {};
  }
}

/**
 * Update zaposlenog
 */
export async function updateEmployeeApi(
  id: string,
  patch: Partial<Pick<EmployeeDto, "name" | "email" | "jobTitle" | "role">>,
): Promise<EmployeeDto> {
  try {
    const updated = await apiFetch<EmployeeDto>(`/api/zaposleni/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    });
    return updated;
  } catch (err) {
    console.error("Greška pri izmeni zaposlenog:", err);
    throw err;
  }
}

export async function addServiceToEmployee(
  zaposleniId: string,
  uslugaId: number,
): Promise<{ ok: boolean; message?: string }> {
  const res = await apiFetch<{ ok: boolean; message?: string }>(
    "/api/zaposleni-usluge",
    {
      method: "POST",
      body: JSON.stringify({ zaposleniId, uslugaId }),
    },
  );

  return res; // može biti { ok: true, data } ili { ok: false, message }
}
