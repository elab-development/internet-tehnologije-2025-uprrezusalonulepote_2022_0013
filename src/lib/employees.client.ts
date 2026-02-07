import { EmployeeDto, ServiceDto, ShiftDto } from "@/shared/types";
import { mockEmployees, mockServices, mockShifts } from "@/mock/data";


// mock-first in-memory store (važi dok je dev server upaljen)
let employeesStore = [...mockEmployees];

// mock-first in-memory store (važi dok je dev server upaljen)
let shiftsStore = [...mockShifts];

export async function getAllEmployees(): Promise<EmployeeDto[]> {
  return employeesStore;
}

export async function updateEmployeeMock(
  id: string,
  patch: Partial<Pick<EmployeeDto, "name" | "email" | "phone" | "jobTitle">>
): Promise<EmployeeDto | null> {
  const idx = employeesStore.findIndex((e) => e.id === id);
  if (idx === -1) return null;

  employeesStore[idx] = {
    ...employeesStore[idx],
    ...patch,
  };

  return employeesStore[idx];
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

  for (const sh of shiftsStore) {
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

export async function updateShiftMock(
  shiftId: string,
  patch: Partial<Pick<ShiftDto, "date" | "startTime" | "endTime" | "breakStart" | "breakEnd">>
): Promise<ShiftDto | null> {
  const idx = shiftsStore.findIndex((s) => s.id === shiftId);
  if (idx === -1) return null;

  shiftsStore[idx] = { ...shiftsStore[idx], ...patch };
  return shiftsStore[idx];
}