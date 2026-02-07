"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createService } from "@/lib/services.client";

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

      // refetch server page (getServices)
      router.refresh();

    } catch (e: any) {
      setErr(e?.message ?? "Greška");
    }
  }

  return (
    <div className="border rounded-lg p-4 mb-6">
      <h2 className="font-semibold mb-3">Dodaj uslugu</h2>

      {err && <div className="border p-2 rounded mb-3">{err}</div>}

      <form onSubmit={onSubmit} className="grid gap-3">
        <input
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Naziv usluge"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            className="border p-2 rounded"
            type="number"
            value={durationMin}
            onChange={(e) => setDurationMin(Number(e.target.value))}
            placeholder="Trajanje (min)"
          />
          <input
            className="border p-2 rounded"
            type="number"
            value={priceRsd}
            onChange={(e) => setPriceRsd(Number(e.target.value))}
            placeholder="Cena (RSD)"
          />
        </div>

        <input
          className="border p-2 rounded"
          value={employeeIdsText}
          onChange={(e) => setEmployeeIdsText(e.target.value)}
          placeholder="ID-jevi zaposlenih (npr: e1,e2)"
        />

        <button className="bg-black text-white p-2 rounded">
          Sačuvaj uslugu
        </button>
      </form>
    </div>
  );
}