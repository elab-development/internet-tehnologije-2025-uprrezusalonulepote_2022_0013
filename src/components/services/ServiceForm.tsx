"use client";

import { useEffect, useState } from "react";
import { createService, updateService } from "@/lib/services.client";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { ServiceDto } from "@/shared/types";

type Props = {
  initial?: ServiceDto | null; // ako postoji => edit
  onSaved?: (service: ServiceDto) => void;
};

export default function ServiceForm({ initial, onSaved }: Props) {
  const isEdit = Boolean(initial?.id);

  const [name, setName] = useState("Šišanje");
  const [durationMin, setDurationMin] = useState(45);
  const [priceRsd, setPriceRsd] = useState(2500);
  const [employeeIdsText, setEmployeeIdsText] = useState("e1"); // csv: e1,e2
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!initial) return;

    setName(initial.name ?? "");
    setDurationMin(initial.durationMin ?? 30);
    setPriceRsd(initial.priceRsd ?? 0);
    setEmployeeIdsText((initial.employeeIds ?? []).join(","));
  }, [initial]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    try {
      const employeeIds = employeeIdsText
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

      const payload = {
        name,
        durationMin: Number(durationMin),
        priceRsd: Number(priceRsd),
        employeeIds,
        createdAt: initial?.createdAt ?? new Date().toISOString(),
      };

      const saved = isEdit
        ? await updateService(initial!.id, payload)
        : await createService(payload);

      onSaved?.(saved);

      // reset samo kad dodaješ novu
      if (!isEdit) {
        setName("");
        setDurationMin(30);
        setPriceRsd(0);
        setEmployeeIdsText("");
      }
    } catch (e) {
      if (e instanceof Error) setErr(e.message);
      else setErr("Greška");
    }
  }

  return (
    <Card className="mb-6">
      <h2 className="font-semibold mb-3">
        {isEdit ? "Izmeni uslugu" : "Dodaj uslugu"}
      </h2>

      {err && <div className="border p-2 rounded mb-3 text-sm">{err}</div>}

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

        <Button type="submit">{isEdit ? "Sačuvaj izmene" : "Sačuvaj uslugu"}</Button>
      </form>
    </Card>
  );
}