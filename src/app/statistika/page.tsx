"use client";

import { useEffect, useMemo, useState } from "react";
import { Chart } from "react-google-charts";

type MesecRow = { mesec: number; broj: number };

const MESECI = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"];

export default function StatistikaPage() {
  const [rows, setRows] = useState<MesecRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:3001/api/analytics/meseci");
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const json = (await res.json()) as MesecRow[];
        setRows(json);
      } catch (e: any) {
        setError(e?.message ?? "Greška");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const data = useMemo(() => {
    const base: (string | number)[][] = [["Mesec", "Rezervacije"]];

    // napravi mapu 1..12 => broj (ako nema, 0)
    const map = new Map<number, number>();
    for (const r of rows) map.set(Number(r.mesec), Number(r.broj));

    for (let m = 1; m <= 12; m++) {
      base.push([MESECI[m - 1], map.get(m) ?? 0]);
    }

    return base;
  }, [rows]);

  const options = {
    title: "Broj rezervacija po mesecima",
    legend: { position: "none" },
    height: 380,
    chartArea: { width: "85%", height: "70%" },
    hAxis: { title: "Mesec" },
    vAxis: { title: "Broj rezervacija", minValue: 0 },
  };

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
        Statistika
      </h1>
      <p style={{ marginBottom: 18, opacity: 0.8 }}>
        Vizualizacija podataka (Google Charts) – broj rezervacija po mesecima.
      </p>

      {loading && <p>Učitavanje…</p>}
      {error && <p style={{ color: "tomato" }}>Greška: {error}</p>}

      {!loading && !error && (
        <div style={{ background: "white", borderRadius: 16, padding: 16 }}>
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="380px"
            data={data}
            options={options}
          />
        </div>
      )}
    </main>
  );
}