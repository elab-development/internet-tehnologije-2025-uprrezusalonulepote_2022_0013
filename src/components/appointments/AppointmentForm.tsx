"use client";

import { useState } from "react";
import { createAppointment } from "@/lib/appointments.client";
import { useRouter } from "next/navigation";

export default function AppointmentForm() {
  const router = useRouter();

  const [date, setDate] = useState("2026-02-12");
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("15:00");
  const [serviceName, setServiceName] = useState("Šišanje");
  const [employeeName, setEmployeeName] = useState("Ana");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    try {
      await createAppointment({ date, startTime, endTime, serviceName, employeeName });
      router.refresh(); // refetch server page (getAppointments)
    } catch (e: any) {
      setErr(e?.message ?? "Greška");
    }
  }

  return (
    <div className="border rounded-lg p-4 mb-6">
      <h2 className="font-semibold mb-3">Zakaži termin</h2>

      {err && <div className="border p-2 rounded mb-3">{err}</div>}

      <form onSubmit={onSubmit} className="grid gap-3">
        <input className="border p-2 rounded" value={serviceName} onChange={(e) => setServiceName(e.target.value)} placeholder="Usluga" />
        <input className="border p-2 rounded" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} placeholder="Zaposleni" />

        <div className="grid grid-cols-3 gap-3">
          <input className="border p-2 rounded" value={date} onChange={(e) => setDate(e.target.value)} placeholder="YYYY-MM-DD" />
          <input className="border p-2 rounded" value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="HH:MM" />
          <input className="border p-2 rounded" value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="HH:MM" />
        </div>

        <button className="bg-black text-white p-2 rounded">
          Sačuvaj termin
        </button>
      </form>
    </div>
  );
}