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

  // Funkcija za učitavanje svih usluga
  async function refresh() {
    setLoading(true);
    try {
      const list = await getServices();
      console.log("SERVICES FROM API:", list);
      setItems(list);
    } catch (error) {
      console.error("Greška pri dohvatanju usluga:", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  // Brisanje usluge
  async function onDelete(id: number) {
    if (!confirm("Obrisati uslugu?")) return;
    try {
      await deleteService(id);
      refresh();
    } catch (error) {
      console.error("Greška pri brisanju usluge:", error);
      alert("Greška pri brisanju usluge.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Admin • Usluge</h1>

      {/* Forma za dodavanje nove usluge */}
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
        <div className="grid gap-3 mt-4">
          {items.map((s) => (
            <Card
              key={s.id}
              className="flex items-center justify-between gap-3 p-4"
            >
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-sm opacity-80">
                  {s.durationMin} min • {s.priceRsd} RSD • zaposleni:{" "}
                  {s.employees.length > 0
                    ? s.employees.map((e) => e.fullName).join(", ")
                    : "-"}
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
