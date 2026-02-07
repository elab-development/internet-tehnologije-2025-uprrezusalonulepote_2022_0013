"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authMe } from "@/lib/auth.client";
import { getAllEmployees, getEmployeeShiftsMap, updateShiftMock } from "@/lib/employees.client";
import { EmployeeDto, ShiftDto, UserDto } from "@/shared/types";

type ShiftForm = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
};

export default function AdminEmployeeShiftsPage() {
  const params = useParams<{ id: string }>();
  const employeeId = useMemo(() => params?.id ?? "", [params]);
  const router = useRouter();

  const [me, setMe] = useState<UserDto | null>(null);
  const [employee, setEmployee] = useState<EmployeeDto | null>(null);
  const [shifts, setShifts] = useState<ShiftDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState<ShiftForm | null>(null);

  useEffect(() => {
    async function run() {
      const current = await authMe();
      setMe(current);

      if (current?.role === "ADMIN") {
        const all = await getAllEmployees();
        const found = all.find((e) => e.id === employeeId) ?? null;
        setEmployee(found);

        const shiftsMap = await getEmployeeShiftsMap();
        setShifts(shiftsMap[employeeId] ?? []);
      }

      setLoading(false);
    }
    run();
  }, [employeeId]);

  function startEdit(sh: ShiftDto) {
    setEditing({
      id: sh.id,
      date: sh.date,
      startTime: sh.startTime,
      endTime: sh.endTime,
      breakStart: sh.breakStart ?? "",
      breakEnd: sh.breakEnd ?? "",
    });
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;

    const updated = await updateShiftMock(editing.id, {
      date: editing.date,
      startTime: editing.startTime,
      endTime: editing.endTime,
      breakStart: editing.breakStart || undefined,
      breakEnd: editing.breakEnd || undefined,
    });

    if (!updated) {
      alert("Greška: smena nije pronađena.");
      return;
    }

    // osveži listu lokalno
    setShifts((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setEditing(null);
    alert("Sačuvano (mock)");
  }

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Izmena smena</h1>
        <p>Učitavanje...</p>
      </div>
    );
  }

  if (!me || me.role !== "ADMIN") {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Izmena smena</h1>
        <p>Nemaš pristup.</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Izmena smena</h1>
        <p>Zaposleni nije pronađen.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Izmena smena</h1>
        <Link href={`/admin/employees/${employeeId}`} className="underline">
          Nazad na detalj
        </Link>
      </div>

      <div className="border rounded p-4 mb-6">
        <div className="text-xl font-semibold">{employee.name}</div>
        <div className="opacity-80 text-sm">{employee.email}</div>
      </div>

      <div className="border rounded p-4">
        <div className="font-semibold mb-3">Smene</div>

        {shifts.length ? (
          <ul className="space-y-2">
            {shifts.map((sh) => (
              <li key={sh.id} className="border rounded p-3 flex items-center justify-between gap-4">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span className="font-semibold">{sh.date}</span>
                  <span>
                    {sh.startTime}–{sh.endTime}
                  </span>
                  {sh.breakStart && sh.breakEnd ? (
                    <span className="opacity-80">
                      Pauza: {sh.breakStart}–{sh.breakEnd}
                    </span>
                  ) : (
                    <span className="opacity-60">Bez pauze</span>
                  )}
                </div>

                <button className="border rounded px-3 py-1" onClick={() => startEdit(sh)}>
                  Izmeni
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="opacity-70">Nema unetih smena.</p>
        )}
      </div>

      {editing ? (
        <div className="border rounded p-4 mt-6">
          <div className="font-semibold mb-3">Izmena smene</div>

          <form onSubmit={saveEdit} className="space-y-3">
            <div>
              <label className="block text-sm opacity-80 mb-1">Datum</label>
              <input
                className="w-full border rounded px-3 py-2 bg-transparent"
                value={editing.date}
                onChange={(e) => setEditing((p) => (p ? { ...p, date: e.target.value } : p))}
                placeholder="YYYY-MM-DD"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm opacity-80 mb-1">Početak</label>
                <input
                  className="w-full border rounded px-3 py-2 bg-transparent"
                  value={editing.startTime}
                  onChange={(e) => setEditing((p) => (p ? { ...p, startTime: e.target.value } : p))}
                  placeholder="HH:mm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm opacity-80 mb-1">Kraj</label>
                <input
                  className="w-full border rounded px-3 py-2 bg-transparent"
                  value={editing.endTime}
                  onChange={(e) => setEditing((p) => (p ? { ...p, endTime: e.target.value } : p))}
                  placeholder="HH:mm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm opacity-80 mb-1">Pauza start (opciono)</label>
                <input
                  className="w-full border rounded px-3 py-2 bg-transparent"
                  value={editing.breakStart}
                  onChange={(e) => setEditing((p) => (p ? { ...p, breakStart: e.target.value } : p))}
                  placeholder="HH:mm"
                />
              </div>

              <div>
                <label className="block text-sm opacity-80 mb-1">Pauza end (opciono)</label>
                <input
                  className="w-full border rounded px-3 py-2 bg-transparent"
                  value={editing.breakEnd}
                  onChange={(e) => setEditing((p) => (p ? { ...p, breakEnd: e.target.value } : p))}
                  placeholder="HH:mm"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="border rounded px-4 py-2" type="submit">
                Sačuvaj (mock)
              </button>
              <button className="underline text-sm" type="button" onClick={() => setEditing(null)}>
                Otkaži
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}