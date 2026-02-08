import { EmployeeDto, ServiceDto, ShiftDto } from "@/shared/types";
import { mockEmployees, mockServices, mockShifts } from "@/mock/data";

const SHIFTS_LS_KEY = "mock_shifts";

function loadShiftsFromLS(): ShiftDto[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SHIFTS_LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveShiftsToLS(shifts: ShiftDto[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SHIFTS_LS_KEY, JSON.stringify(shifts));
}


const EMPLOYEES_LS_KEY = "mock_employees";

function loadEmployeesFromLS(): EmployeeDto[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(EMPLOYEES_LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEmployeesToLS(employees: EmployeeDto[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(EMPLOYEES_LS_KEY, JSON.stringify(employees));
}


let employeesStore: EmployeeDto[] =
  typeof window !== "undefined" && loadEmployeesFromLS().length
    ? loadEmployeesFromLS()
    : [...mockEmployees];


let shiftsStore: ShiftDto[] =
  typeof window !== "undefined" && loadShiftsFromLS().length
    ? loadShiftsFromLS()
    : [...mockShifts];

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

  saveEmployeesToLS(employeesStore);
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
  saveShiftsToLS(shiftsStore);

  return shiftsStore[idx];
}

export async function createShiftMock(
  shift: Omit<ShiftDto, "id">
): Promise<ShiftDto> {
  const newShift: ShiftDto = {
    id: `sh_${Date.now()}`,
    ...shift,
  };

  shiftsStore.push(newShift);
  saveShiftsToLS(shiftsStore);

  return newShift;
}