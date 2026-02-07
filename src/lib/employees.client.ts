import { EmployeeDto, ServiceDto } from "@/shared/types";
import { mockEmployees, mockServices } from "@/mock/data";

export async function getAllEmployees(): Promise<EmployeeDto[]> {
  return mockEmployees;
}

export async function getEmployeeServicesMap(): Promise<Record<string, ServiceDto[]>> {
  const map: Record<string, ServiceDto[]> = {};

  for (const s of mockServices) {
    for (const eid of s.employeeIds) {
      if (!map[eid]) map[eid] = [];
      map[eid].push(s);
    }
  }

  return map;
}