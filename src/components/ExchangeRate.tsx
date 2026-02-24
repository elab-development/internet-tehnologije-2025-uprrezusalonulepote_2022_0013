"use client";

import { useEffect, useState } from "react";

export default function ExchangeRate() {
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/exchange")
      .then((r) => r.json())
      .then((data) => setRate(data?.rate ?? null))
      .catch(() => setRate(null));
  }, []);

  if (rate === null) return null;

  return (
  <div className="mb-6 p-3 border border-white/20 rounded bg-white/5 text-white text-sm">
    Trenutni kurs: 1 EUR = {rate.toFixed(2)} RSD
  </div>
);
}