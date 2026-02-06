import { getAppointments } from "@/lib/appointments.client";

export default async function AppointmentsPage() {
  const bookings = await getAppointments();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Zakazani termini</h1>
      <ul className="space-y-3">
        {bookings.map(b => (
          <li key={b.id} className="border p-4 rounded">
            <div>Datum: {b.date}</div>
            <div>Vreme: {b.startTime} – {b.endTime}</div>
            <div>Status: {b.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}