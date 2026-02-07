import { authMe } from "@/lib/auth.client";
import { getServices } from "@/lib/services.client";
import ServiceForm from "@/components/services/ServiceForm";

export default async function AdminServicesPage() {
  const me = await authMe();

  if (!me || me.role !== "ADMIN") {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Admin / Usluge</h1>
        <p>Nemaš pristup.</p>
      </div>
    );
  }

  const services = await getServices();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin / Usluge</h1>

      <ServiceForm />

      <div className="space-y-3">
        {services.map((s) => (
          <div key={s.id} className="border p-4 rounded flex justify-between">
            <div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-sm text-gray-600">
                {s.durationMin} min • {s.priceRsd} RSD
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {s.employeeIds.length} zapos.
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <p className="text-gray-600">Nema usluga.</p>
        )}
      </div>
    </div>
  );
}