"use client";

import { useEffect, useMemo, useState } from "react";
import { authMe } from "@/lib/auth.client";
import { getServices } from "@/lib/services.client";
import ServiceForm from "@/components/services/ServiceForm";
import Card from "@/components/ui/Card";
import { mockEmployees } from "@/mock/data";
import { ServiceDto, UserDto } from "@/shared/types";

export default function ServicesPage() {
  const [me, setMe] = useState<UserDto | null>(null);
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const user = await authMe();
        setMe(user);

        if (user?.role === "ADMIN") {
          const s = await getServices();
          setServices(s);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const employeeById = useMemo(() => {
    return new Map(mockEmployees.map((e) => [e.id, e.name]));
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Admin / Usluge</h1>
        <p>Učitavanje...</p>
      </div>
    );
  }

  if (!me || me.role !== "ADMIN") {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Admin / Usluge</h1>
        <p>Nemaš pristup.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin / Usluge</h1>

      {}
      <ServiceForm
        onCreated={async () => {
          const s = await getServices();
          setServices(s);
        }}
      />

      <div className="space-y-3">
        {services.map((s) => {
          const employeeNames = s.employeeIds
            .map((id) => employeeById.get(id) ?? id)
            .join(", ");

          return (
            <Card key={s.id} className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-gray-600">
                  {s.durationMin} min • {s.priceRsd} RSD
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Zaposleni: {employeeNames || "—"}
                </div>
              </div>

              <div className="text-xs text-gray-500">ID: {s.id}</div>
            </Card>
          );
        })}

        {services.length === 0 && <p className="text-gray-600">Nema usluga.</p>}
      </div>
    </div>
  );
}