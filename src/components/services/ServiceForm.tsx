"use client";

import { useEffect, useState } from "react";
import { createService, updateService } from "@/lib/services.client";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { ServiceDto } from "@/shared/types";

type Props = {
  initial?: ServiceDto | null;
  onSaved?: (service: ServiceDto) => void;
};

export default function ServiceForm({ initial, onSaved }: Props) {
  const isEdit = Boolean(initial?.id);

  console.log("INITIAL:", initial);

  const [name, setName] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [priceRsd, setPriceRsd] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!initial) return;

    setName(initial.name ?? "");
    setDurationMin(
      initial.durationMin !== undefined ? String(initial.durationMin) : "",
    );
    setPriceRsd(initial.priceRsd !== undefined ? String(initial.priceRsd) : "");
  }, [initial]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!name.trim() || !durationMin || !priceRsd) {
      setErr("Sva polja su obavezna.");
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        durationMin: Number(durationMin),
        priceRsd: Number(priceRsd),
      };

      const saved = isEdit
        ? await updateService(initial!.id, payload)
        : await createService(payload);

      onSaved?.(saved);

      if (!isEdit) {
        setName("");
        setDurationMin("");
        setPriceRsd("");
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

      {err && (
        <div className="border p-2 rounded mb-3 text-sm text-red-600">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="grid gap-4">
        <div>
          <label className="block text-sm mb-1">Naziv usluge</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Unesite naziv usluge"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Trajanje usluge (u minutima)
          </label>
          <Input
            type="number"
            value={durationMin}
            onChange={(e) => setDurationMin(e.target.value)}
            placeholder="Unesite trajanje u minutima (npr. 45)"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Cena usluge (u dinarima)</label>
          <Input
            type="number"
            value={priceRsd}
            onChange={(e) => setPriceRsd(e.target.value)}
            placeholder="Unesite cenu u RSD (npr. 2500)"
            required
          />
        </div>

        <Button type="submit">
          {isEdit ? "Sačuvaj izmene" : "Sačuvaj uslugu"}
        </Button>
      </form>
    </Card>
  );
}
