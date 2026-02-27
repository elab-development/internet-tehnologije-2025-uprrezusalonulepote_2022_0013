"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { getAllEmployeesFromApi } from "@/lib/employees.client";
import { getServices } from "@/lib/services.client";
import { createAppointment } from "@/lib/appointments.client";
import { BookingDto, ServiceDto, EmployeeDto } from "@/shared/types";
import { authMe } from "@/lib/auth.client";

type Props = {
  onCreated?: (booking: BookingDto) => void;
};

function isValidTimeHHmm(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export default function AppointmentForm({ onCreated }: Props) {
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);

  const [serviceId, setServiceId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState("10:00");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [s, e] = await Promise.all([
        getServices(),
        getAllEmployeesFromApi(),
      ]);
      setServices(s);
      setEmployees(e);
    }
    load();
  }, []);

  const selectedService = useMemo(
    () => services.find((s) => s.id === Number(serviceId)) ?? null,
    [services, serviceId],
  );

  const filteredEmployees = useMemo(() => {
    if (!selectedService) return employees;
    return employees.filter((emp) =>
      selectedService.employees?.map((e) => String(e.id)).includes(emp.id),
    );
  }, [employees, selectedService]);

  useEffect(() => {
    setEmployeeId("");
  }, [serviceId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    try {
      if (!selectedService) throw new Error("Izaberi uslugu");
      if (!employeeId) throw new Error("Izaberi zaposlenog");
      if (!date) throw new Error("Izaberi datum");
      if (!isValidTimeHHmm(startTime))
        throw new Error("Vreme mora biti u formatu HH:mm");

      const employee = employees.find((x) => x.id === employeeId);
      if (!employee) throw new Error("Izabrani zaposleni ne postoji");

      const me = await authMe();
      if (!me) throw new Error("Nisi ulogovan");

      const [hh, mm] = startTime.split(":").map(Number);
      const datumVreme = new Date(date);
      datumVreme.setHours(hh, mm, 0, 0);

      const created = await createAppointment({
        datumVreme,
        zaposleniId: Number(employee.id),
        uslugaId: selectedService.id,
      });

      onCreated?.(created);
      setServiceId("");
      setEmployeeId("");
    } catch (e) {
      if (e instanceof Error) setErr(e.message);
      else setErr("Greška");
    }
  }

  return (
    <Card className="mb-6">
      <h2 className="font-semibold mb-3">Zakaži termin</h2>
      {err && <div className="border p-2 rounded mb-3 text-sm">{err}</div>}

      <form onSubmit={onSubmit} className="grid gap-3">
        <div className="grid gap-1">
          <div className="text-sm opacity-80">Usluga</div>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="border rounded px-3 py-2 bg-transparent"
          >
            <option value="">-- izaberi uslugu --</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.durationMin}min, {s.priceRsd} RSD)
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1">
          <div className="text-sm opacity-80">Zaposleni</div>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            disabled={!serviceId}
            className="border rounded px-3 py-2 bg-transparent"
          >
            <option value="">-- izaberi zaposlenog --</option>
            {filteredEmployees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.jobTitle})
              </option>
            ))}
          </select>
          {!serviceId && (
            <div className="text-xs opacity-70">
              Prvo izaberi uslugu da bi filtrirao zaposlene.
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <Button type="submit">Zakaži</Button>
      </form>
    </Card>
  );
}
