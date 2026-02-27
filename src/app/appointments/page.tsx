"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import { getAppointments } from "@/lib/appointments.client";
import { BookingDto, EmployeeDto } from "@/shared/types";
import { getAllEmployeesFromApi } from "@/lib/employees.client";

export default function AppointmentsPage() {
  const [items, setItems] = useState<BookingDto[]>([]);
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);

    const list = await getAppointments();
    const emps = employees.length ? employees : await getAllEmployeesFromApi();
    setEmployees(emps);

    setItems(list);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  function getEmployeeName(id: number) {
    const emp = employees.find((e) => e.id === id.toString());
    return emp ? emp.name : `Zaposleni #${id}`;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Termini</h1>

      <AppointmentForm
        onCreated={async () => {
          await refresh();
        }}
      />
    </div>
  );
}
