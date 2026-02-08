import { ServiceDto } from "@/shared/types";
import { mockServices } from "@/mock/data";

// kasnije: USE_MOCK = false
const USE_MOCK = true;

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
  // placeholder za backend
  return [];
}

export async function getServiceById(id: string): Promise<ServiceDto | null> {
  if (USE_MOCK) {
    const items = readFromStorage();
    return Promise.resolve(items.find((s) => s.id === id) ?? null);
  }
  throw new Error("Backend nije implementiran");
}

export async function createService(
  data: Omit<ServiceDto, "id">
): Promise<ServiceDto> {
  if (USE_MOCK) {
    const items = readFromStorage();

    const newService: ServiceDto = {
      id: Date.now().toString(),
      ...data,
    };

    const next = [newService, ...items];
    writeToStorage(next);

    return Promise.resolve(newService);
  }

  throw new Error("Backend nije implementiran");
}

export async function updateService(
  id: string,
  data: Partial<Omit<ServiceDto, "id">>
): Promise<ServiceDto> {
  if (USE_MOCK) {
    const items = readFromStorage();
    const idx = items.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Usluga nije pronađena");

    const updated: ServiceDto = { ...items[idx], ...data, id };
    const next = [...items];
    next[idx] = updated;

    writeToStorage(next);
    return Promise.resolve(updated);
  }

  throw new Error("Backend nije implementiran");
}

export async function deleteService(id: string): Promise<void> {
  if (USE_MOCK) {
    const items = readFromStorage();
    const next = items.filter((s) => s.id !== id);
    writeToStorage(next);
    return Promise.resolve();
  }

  throw new Error("Backend nije implementiran");
}