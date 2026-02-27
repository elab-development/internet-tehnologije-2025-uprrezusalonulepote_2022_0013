export type UserRole = "CLIENT" | "EMPLOYEE" | "ADMIN";

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string; // ISO
}

export interface EmployeeShortDto {
  id: number;
  fullName: string; // spojeno ime + prezime
}

export interface ServiceDto {
  id: number;
  name: string;
  priceRsd: number;
  durationMin: number;
  employees: EmployeeShortDto[];
}

export interface EmployeeDto {
  id: string;
  name: string;
  email: string;
  jobTitle: "KOZMETICAR" | "SMINKER" | "FRIZER";
  role: "ZAPOSLENI" | "ADMIN";
}

export interface ShiftDto {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  breakStart?: string;
  breakEnd?: string;
}

export type BookingStatus = "ZAKAZAN" | "U_TOKU" | "ZAVRSEN" | "OTKAZAN";

export type BookingDto = {
  datumVreme: Date;
  napomena?: string;
  zaposleniId: number;
  uslugaId: number;
};
