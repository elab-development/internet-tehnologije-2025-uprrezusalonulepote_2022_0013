// src/shared/types.ts
export type UserRole = "CLIENT" | "EMPLOYEE" | "ADMIN";

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string; // ISO
}

export interface ServiceDto {
  id: string;
  name: string;
  durationMin: number;
  priceRsd: number;
  employeeIds: string[]; // ko može da radi uslugu
  createdAt: string;
}

export interface EmployeeDto {
  id: string;
  name: string;
  email: string;
  jobTitle: "KOZMETICAR" | "SMINKER" | "FRIZER";
  phone?: string;
  createdAt: string;
}

export interface ShiftDto {
  id: string;
  employeeId: string;
  date: string;      // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  breakStart?: string;
  breakEnd?: string;
}

export type BookingStatus = "ZAKAZAN" | "U_TOKU" | "ZAVRSEN" | "OTKAZAN";

export interface BookingDto {
  id: string;
  clientId: string;
  employeeId: string;
  serviceId: string;
  date: string;      // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  status: BookingStatus;
  createdAt: string;
}