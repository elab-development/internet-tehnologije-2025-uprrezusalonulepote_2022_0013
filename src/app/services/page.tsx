"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import { getServices } from "@/lib/services.client";
import { mockEmployees } from "@/mock/data";
import { ServiceDto } from "@/shared/types";

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const s = await getServices();
        setServices(s);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const employeeById = useMemo(() => {
    return new Map(mockEmployees.map((e) => [e.id, e.name]));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Usluge</h1>

      {loading ? (
        <div>Učitavanje...</div>
      ) : services.length === 0 ? (
        <div>Nema usluga.</div>
      ) : (
        <div className="grid gap-3">
          {services.map((s) => {
            const employeeNames = (s.employeeIds ?? [])
              .map((id) => employeeById.get(id) ?? id)
              .join(", ");

            return (
              <Card key={s.id} className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm opacity-80">
                    {s.durationMin} min • {s.priceRsd} RSD
                  </div>
                  <div className="text-sm opacity-80 mt-1">
                    Zaposleni: {employeeNames || "—"}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}