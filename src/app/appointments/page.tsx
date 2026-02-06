import { getAppointments } from "@/lib/appointments.client";

export default async function AppointmentsPage() {
  const bookings = await getAppointments();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Moji termini</h1>

      <ul className="space-y-4">
        {bookings.map((b) => (
          <li key={b.id} className="border rounded-lg p-4">
            <div className="font-semibold">{b.serviceName}</div>
            <div className="text-sm text-gray-600">
              {b.date} · {b.startTime}–{b.endTime}
            </div>
            <div className="text-sm">Zaposleni: {b.employeeName}</div>
            <div className="text-sm mt-1">
              Status: <b>{b.status}</b>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}