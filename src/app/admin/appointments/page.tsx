"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { getAppointments, updateAppointmentStatus } from "@/lib/appointments.client";
import { BookingDto, BookingStatus } from "@/shared/types";

export default function AdminAppointmentsPage() {
  const [items, setItems] = useState<BookingDto[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const list = await getAppointments();
    setItems(list);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function setStatus(id: string, status: BookingStatus) {
    await updateAppointmentStatus(id, status);
    refresh();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Admin • Rezervacije</h1>

      {loading ? (
        <div>Učitavanje...</div>
      ) : items.length === 0 ? (
        <div>Nema rezervacija.</div>
      ) : (
        <div className="grid gap-3">
          {items.map((b) => (
            <Card key={b.id} className="grid gap-2">
              <div className="font-medium">
                {b.serviceName} • {b.employeeName}
              </div>

              <div className="text-sm opacity-80">
                {b.date} • {b.startTime}–{b.endTime}
              </div>

              <div className="text-sm">
                Status: <b>{b.status}</b>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button onClick={() => setStatus(b.id, "ZAKAZAN")}>Zakaži</Button>
                <Button onClick={() => setStatus(b.id, "U_TOKU")}>U toku</Button>
                <Button onClick={() => setStatus(b.id, "ZAVRSEN")}>Završeno</Button>
                <Button onClick={() => setStatus(b.id, "OTKAZAN")}>Otkaži</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}