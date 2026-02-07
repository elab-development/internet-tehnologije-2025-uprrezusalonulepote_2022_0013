import { EmployeeDto } from "@/shared/types";
import { mockEmployees } from "@/mock/data";

export async function getAllEmployees(): Promise<EmployeeDto[]> {
  return mockEmployees;
}