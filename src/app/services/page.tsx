import { getServices } from "@/lib/services.client";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Usluge</h1>
      <ul className="space-y-3">
        {services.map(s => (
          <li key={s.id} className="border p-4 rounded flex justify-between">
            <span>{s.name}</span>
            <span>{s.priceRsd} RSD</span>
          </li>
        ))}
      </ul>
    </div>
  );
}