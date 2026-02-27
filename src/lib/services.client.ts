import { ServiceDto } from "@/shared/types";
import { mockServices } from "@/mock/data";
//import { endpoints } from "@/lib/endpoints";
import { apiFetch } from "./api";

const USE_MOCK = false;

// localStorage key
const LS_KEY = "iteh_services_v1";

function hasWindow() {
  return typeof window !== "undefined";
}

function readFromStorage(): ServiceDto[] {
  if (!hasWindow()) return mockServices;

  const raw = window.localStorage.getItem(LS_KEY);
  if (!raw) {
    // init seed
    window.localStorage.setItem(LS_KEY, JSON.stringify(mockServices));
    return [...mockServices];
  }

  try {
    const parsed = JSON.parse(raw) as ServiceDto[];
    return Array.isArray(parsed) ? parsed : [...mockServices];
  } catch {
    window.localStorage.setItem(LS_KEY, JSON.stringify(mockServices));
    return [...mockServices];
  }
}

function writeToStorage(items: ServiceDto[]) {
  if (!hasWindow()) return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export async function getServices(): Promise<ServiceDto[]> {
  if (USE_MOCK) {
    return Promise.resolve(readFromStorage());
  }

  const data = await apiFetch<ServiceDto[]>("/api/usluge");

  // API već vraća polja name, priceRsd, durationMin i employees
  return data.map((d) => ({
    id: d.id,
    name: d.name,
    durationMin: d.durationMin,
    priceRsd: d.priceRsd,
    employees: d.employees ?? [],
  }));
}

export async function getServiceById(id: number): Promise<ServiceDto | null> {
  if (USE_MOCK) {
    const items = readFromStorage();
    return Promise.resolve(items.find((s) => s.id === id) ?? null);
  }
  try {
    return await apiFetch<ServiceDto>(`/api/usluge/${id}`);
  } catch (err) {
    // Ako usluga ne postoji, vratimo null
    return null;
  }
}

export type CreateServiceInput = {
  name: string;
  durationMin: number;
  priceRsd: number;
};

export type UpdateServiceInput = CreateServiceInput;

export async function createService(
  data: CreateServiceInput,
): Promise<ServiceDto> {
  return apiFetch<ServiceDto>("/api/usluge", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateService(
  id: number,
  data: UpdateServiceInput,
): Promise<ServiceDto> {
  return apiFetch<ServiceDto>(`/api/usluge/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteService(id: number): Promise<void> {
  if (USE_MOCK) {
    const items = readFromStorage();
    writeToStorage(items.filter((s) => s.id !== id));
    return Promise.resolve();
  }
  await apiFetch<void>(`/api/usluge/${id}`, { method: "DELETE" });
}
