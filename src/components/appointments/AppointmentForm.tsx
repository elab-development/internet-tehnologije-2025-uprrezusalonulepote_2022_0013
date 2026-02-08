"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { getAllEmployees } from "@/lib/employees.client";
import { getServices } from "@/lib/services.client";
import { createAppointment } from "@/lib/appointments.client";
import { BookingDto, BookingStatus, EmployeeDto, ServiceDto } from "@/shared/types";
import { getCurrentUserFromStorage } from "@/lib/session.client";

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

const [date, setDate] = useState("2026-02-10");
const [startTime, setStartTime] = useState("10:00");
const [err, setErr] = useState<string | null>(null);

useEffect(() => {
  async function load() {
    const [s, e] = await Promise.all([getServices(), getAllEmployees()]);
    setServices(s);
    setEmployees(e);
  }
  load();
}, []);

const selectedService = useMemo(
  () => services.find((s) => s.id === serviceId) ?? null,
  [services, serviceId]
);

const filteredEmployees = useMemo(() => {
  if (!selectedService) return employees;
  return employees.filter((emp) => selectedService.employeeIds.includes(emp.id));
}, [employees, selectedService]);

// Kad promeniš uslugu, resetuj zaposlenog (da ne ostane invalid selection)
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
    if (!isValidTimeHHmm(startTime)) throw new Error("Vreme mora biti u formatu HH:mm");

    const employee = employees.find((x) => x.id === employeeId);
    if (!employee) throw new Error("Izabrani zaposleni ne postoji");

    // endTime = startTime + durationMin (basic)
    const [hh, mm] = startTime.split(":").map(Number);
    const startMin = hh * 60 + mm;
    const endMin = startMin + selectedService.durationMin;

    const endH = String(Math.floor(endMin / 60)).padStart(2, "0");
    const endM = String(endMin % 60).padStart(2, "0");
    const endTime = `${endH}:${endM}`;

    const me = getCurrentUserFromStorage();
    if (!me) throw new Error("Nisi ulogovan");

    const created = await createAppointment({
userId: me.id, // TEMP (A2: uzimamo iz auth-a)
date,
startTime,
endTime,
status: "ZAKAZAN",
serviceName: selectedService.name,
employeeName: employee.name,
});

    onCreated?.(created);

    // reset (datum i vreme ostavljamo)
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
          className="border rounded px-3 py-2 bg-transparent"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
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
          className="border rounded px-3 py-2 bg-transparent"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          disabled={!serviceId}
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
        <Input value={date} onChange={(e) => setDate(e.target.value)} />
        <Input value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </div>

      <Button type="submit">Zakaži</Button>
    </form>
  </Card>
);
}