"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authMe } from "@/lib/auth.client";
import { getAllEmployeesFromApi } from "@/lib/employees.client";
import { EmployeeDto, UserDto } from "@/shared/types";

export default function AdminEmployeesPage() {
  const [me, setMe] = useState<UserDto | null>(null);
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      const current = await authMe();
      setMe(current);

      if (current?.role === "ADMIN") {
        const all = await getAllEmployeesFromApi();
        setEmployees(all);
      }

      setLoading(false);
    }

    run();
  }, []);

  if (loading)
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Zaposleni</h1>
        <p>Učitavanje...</p>
      </div>
    );

  if (!me || me.role !== "ADMIN")
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Zaposleni</h1>
        <p>Nemaš pristup.</p>
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Zaposleni</h1>

      {employees.length ? (
        employees.map((e) => (
          <div
            key={e.id}
            className="border rounded p-4 flex items-center justify-between"
          >
            <div>
              <div className="text-lg font-semibold">{e.name}</div>
              <div className="text-sm opacity-80">{e.email}</div>
              <div className="text-sm opacity-70">{e.jobTitle}</div>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/admin/employees/${e.id}`}
                className="underline text-blue-600"
              >
                Detalji
              </Link>
              <Link
                href={`/admin/employees/${e.id}/edit`}
                className="underline text-green-600"
              >
                Izmeni
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p className="opacity-70">Nema zaposlenih.</p>
      )}
    </div>
  );
}
