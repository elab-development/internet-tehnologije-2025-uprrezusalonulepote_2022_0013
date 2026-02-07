import { ServiceDto } from "@/shared/types";
import { mockServices } from "@/mock/data";

// kasnije: USE_MOCK = false
const USE_MOCK = true;

export async function getServices(): Promise<ServiceDto[]> {
  if (USE_MOCK) {
    return Promise.resolve(mockServices);
  }

  // placeholder za backend
  return [];
}

export async function createService(
  data: Omit<ServiceDto, "id">
): Promise<ServiceDto> {
  if (USE_MOCK) {
    const newService: ServiceDto = {
      id: Date.now().toString(),
      ...data,
    };

    mockServices.push(newService);
    return Promise.resolve(newService);
  }

  throw new Error("Backend nije implementiran");
}