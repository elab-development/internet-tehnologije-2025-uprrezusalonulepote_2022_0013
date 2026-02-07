import { EmployeeDto, ServiceDto, ShiftDto } from "@/shared/types";
import { mockEmployees, mockServices, mockShifts } from "@/mock/data";


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

export async function getEmployeeShiftsMap(): Promise<Record<string, ShiftDto[]>> {
  const map: Record<string, ShiftDto[]> = {};

  for (const sh of mockShifts) {
    if (!map[sh.employeeId]) map[sh.employeeId] = [];
    map[sh.employeeId].push(sh);
  }

  // opcionalno: sortiraj po datumu + startTime (za lepši prikaz)
  for (const key of Object.keys(map)) {
    map[key].sort((a, b) => {
      const aa = `${a.date} ${a.startTime}`;
      const bb = `${b.date} ${b.startTime}`;
      return aa.localeCompare(bb);
    });
  }

  return map;
}