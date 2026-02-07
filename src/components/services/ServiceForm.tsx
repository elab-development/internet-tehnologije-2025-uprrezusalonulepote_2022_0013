"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createService } from "@/lib/services.client";

import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ServiceForm() {
  const router = useRouter();

  const [name, setName] = useState("Šišanje");
  const [durationMin, setDurationMin] = useState(45);
  const [priceRsd, setPriceRsd] = useState(2500);
  const [employeeIdsText, setEmployeeIdsText] = useState("e1"); // csv: e1,e2
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    try {
      const employeeIds = employeeIdsText
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

      await createService({
        name,
        durationMin: Number(durationMin),
        priceRsd: Number(priceRsd),
        employeeIds,
        createdAt: new Date().toISOString(),
      });

      router.refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Greška");
    }
  }

  return (
    <Card className="mb-6">
      <h2 className="font-semibold mb-3">Dodaj uslugu</h2>

      {err && (
        <div className="border p-2 rounded mb-3 text-sm">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="grid gap-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Naziv usluge"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            value={durationMin}
            onChange={(e) => setDurationMin(Number(e.target.value))}
            placeholder="Trajanje (min)"
          />
          <Input
            type="number"
            value={priceRsd}
            onChange={(e) => setPriceRsd(Number(e.target.value))}
            placeholder="Cena (RSD)"
          />
        </div>

        <Input
          value={employeeIdsText}
          onChange={(e) => setEmployeeIdsText(e.target.value)}
          placeholder="ID-jevi zaposlenih (npr: e1,e2)"
        />

        <Button type="submit">Sačuvaj uslugu</Button>
      </form>
    </Card>
  );
}