"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ServiceForm from "@/components/services/ServiceForm";
import { deleteService, getServices } from "@/lib/services.client";
import { ServiceDto } from "@/shared/types";

export default function AdminServicesPage() {
  const [items, setItems] = useState<ServiceDto[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const list = await getServices();
    setItems(list);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onDelete(id: string) {
    if (!confirm("Obrisati uslugu?")) return;
    await deleteService(id);
    refresh();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Admin • Usluge</h1>

      <ServiceForm
        onSaved={() => {
          refresh();
        }}
      />

      {loading ? (
        <div>Učitavanje...</div>
      ) : items.length === 0 ? (
        <div>Nema usluga.</div>
      ) : (
        <div className="grid gap-3">
          {items.map((s) => (
            <Card key={s.id} className="flex items-center justify-between gap-3">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-sm opacity-80">
                  {s.durationMin} min • {s.priceRsd} RSD • zaposleni:{" "}
                  {(s.employeeIds ?? []).join(", ") || "-"}
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/admin/services/${s.id}/edit`}>
                  <Button>Izmeni</Button>
                </Link>
                <Button onClick={() => onDelete(s.id)}>Obriši</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}