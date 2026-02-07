"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authMe } from "@/lib/auth.client";
import {
  getAllEmployees,
  getEmployeeServicesMap,
  getEmployeeShiftsMap,
} from "@/lib/employees.client";
import { EmployeeDto, ServiceDto, ShiftDto, UserDto } from "@/shared/types";

export default function AdminEmployeesPage() {
  const [me, setMe] = useState<UserDto | null>(null);
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [servicesByEmployee, setServicesByEmployee] = useState<Record<string, ServiceDto[]>>({});
  const [shiftsByEmployee, setShiftsByEmployee] = useState<Record<string, ShiftDto[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      const current = await authMe();
      setMe(current);

      if (current?.role === "ADMIN") {
        const list = await getAllEmployees();
        setEmployees(list);

        const servicesMap = await getEmployeeServicesMap();
        setServicesByEmployee(servicesMap);

        const shiftsMap = await getEmployeeShiftsMap();
        setShiftsByEmployee(shiftsMap);
      }

      setLoading(false);
    }

    run();
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Zaposleni</h1>
        <p>Učitavanje...</p>
      </div>
    );
  }

  if (!me || me.role !== "ADMIN") {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Zaposleni</h1>
        <p>Nemaš pristup.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">Zaposleni</h1>
        <Link href="/admin" className="underline">
          Nazad na admin
        </Link>
      </div>

      <ul className="space-y-3">
        {employees.map((e) => (
          <li key={e.id} className="border p-4 rounded">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold">{e.name}</span>
                <span className="text-sm opacity-70">{e.jobTitle}</span>
              </div>

              <div className="text-sm opacity-80">{e.email}</div>
              {e.phone ? <div className="text-sm opacity-80">{e.phone}</div> : null}

              {/* USLUGE */}
              <div className="mt-3 text-sm opacity-80">
                <div className="font-semibold opacity-90 mb-1">Usluge:</div>

                {servicesByEmployee[e.id]?.length ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {servicesByEmployee[e.id].map((s) => (
                      <li key={s.id}>
                        {s.name} ({s.durationMin} min, {s.priceRsd} RSD)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="opacity-70">Nema dodeljenih usluga.</p>
                )}
              </div>

              {/* SMENE */}
              <div className="mt-3 text-sm opacity-80">
                <div className="font-semibold opacity-90 mb-1">Smene:</div>

                {shiftsByEmployee[e.id]?.length ? (
                  <ul className="space-y-2">
                    {shiftsByEmployee[e.id].map((sh) => (
                      <li key={sh.id} className="border rounded p-3">
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <span className="font-semibold">{sh.date}</span>
                          <span>
                            {sh.startTime}–{sh.endTime}
                          </span>

                          {sh.breakStart && sh.breakEnd ? (
                            <span className="opacity-80">
                              Pauza: {sh.breakStart}–{sh.breakEnd}
                            </span>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="opacity-70">Nema unetih smena.</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}