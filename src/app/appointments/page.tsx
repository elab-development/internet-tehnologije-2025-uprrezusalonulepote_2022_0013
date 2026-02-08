"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import { getAppointments } from "@/lib/appointments.client";
import { BookingDto } from "@/shared/types";
import { getMockUser } from "@/lib/session.client";

export default function AppointmentsPage() {
  const [items, setItems] = useState<BookingDto[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
  setLoading(true);

  const list = await getAppointments();
  const me = getMockUser();

  if (!me) {
    setItems([]);
    setLoading(false);
    return;
  }

  const mine = list.filter((b) => b.userId === me.id);
  setItems(mine);
  setLoading(false);
}
  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Termini</h1>

      <AppointmentForm onCreated={() => refresh()} />

      <h2 className="font-semibold mb-3">Rezervacije</h2>

      {loading ? (
        <div>Učitavanje...</div>
      ) : items.length === 0 ? (
        <div>Nema rezervacija.</div>
      ) : (
        <div className="grid gap-3">
          {items.map((b) => (
            <Card key={b.id} className="grid gap-1">
              <div className="font-medium">
                {b.serviceName} • {b.employeeName}
              </div>
              <div className="text-sm opacity-80">
                {b.date} • {b.startTime}–{b.endTime}
              </div>
              <div className="text-sm">
                Status: <b>{b.status}</b>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}