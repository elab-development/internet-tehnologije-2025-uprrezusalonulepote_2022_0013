// src/mock/data.ts
import { BookingDto, EmployeeDto, ServiceDto, ShiftDto, UserDto } from "@/shared/types";

export const mockUsers: UserDto[] = [
  { id: "u1", name: "Ana Klijent", email: "ana@mail.com", role: "CLIENT", createdAt: new Date().toISOString() },
  { id: "u2", name: "Mina Admin", email: "admin@mail.com", role: "ADMIN", createdAt: new Date().toISOString() },
];

export const mockEmployees: EmployeeDto[] = [
  { id: "e1", name: "Jovana Frizer", email: "jovana@salon.com", jobTitle: "FRIZER", phone: "060123123", createdAt: new Date().toISOString() },
  { id: "e2", name: "Teodora Šminker", email: "teodora@salon.com", jobTitle: "SMINKER", createdAt: new Date().toISOString() },
];

export const mockServices: ServiceDto[] = [
  { id: "s1", name: "Fen frizura", durationMin: 45, priceRsd: 2500, employeeIds: ["e1"], createdAt: new Date().toISOString() },
  { id: "s2", name: "Šminka", durationMin: 60, priceRsd: 4000, employeeIds: ["e2"], createdAt: new Date().toISOString() },
];

export const mockShifts: ShiftDto[] = [
  { id: "sh1", employeeId: "e1", date: "2026-02-10", startTime: "10:00", endTime: "18:00", breakStart: "14:00", breakEnd: "14:30" },
  { id: "sh2", employeeId: "e2", date: "2026-02-10", startTime: "12:00", endTime: "20:00" },
];

export const mockBookings: BookingDto[] = [
  { id: "b1", clientId: "u1", employeeId: "e1", serviceId: "s1", date: "2026-02-10", startTime: "11:00", endTime: "11:45", status: "ZAKAZAN", createdAt: new Date().toISOString() },
];