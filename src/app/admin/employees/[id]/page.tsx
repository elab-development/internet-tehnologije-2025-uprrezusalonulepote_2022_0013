"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { authMe } from "@/lib/auth.client";
import {
  getAllEmployees,
  getEmployeeServicesMap,
  getEmployeeShiftsMap,
} from "@/lib/employees.client";
import { EmployeeDto, ServiceDto, ShiftDto, UserDto } from "@/shared/types";

export default function AdminEmployeeDetailsPage() {
  const params = useParams<{ id: string }>();
  const employeeId = useMemo(() => params?.id ?? "", [params]);

  const [me, setMe] = useState<UserDto | null>(null);
  const [employee, setEmployee] = useState<EmployeeDto | null>(null);
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [shifts, setShifts] = useState<ShiftDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      const current = await authMe();
      setMe(current);

      if (current?.role === "ADMIN") {
        const all = await getAllEmployees();
        const found = all.find((e) => e.id === employeeId) ?? null;
        setEmployee(found);

        const servicesMap = await getEmployeeServicesMap();
        setServices(servicesMap[employeeId] ?? []);

        const shiftsMap = await getEmployeeShiftsMap();
        setShifts(shiftsMap[employeeId] ?? []);
      }

      setLoading(false);
    }

    run();
  }, [employeeId]);

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Detalj zaposlenog</h1>
        <p>Učitavanje...</p>
      </div>
    );
  }

  if (!me || me.role !== "ADMIN") {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Detalj zaposlenog</h1>
        <p>Nemaš pristup.</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Detalj zaposlenog</h1>
        <p>Zaposleni nije pronađen.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* HEADER – OVDE JE IZMENI */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Detalj zaposlenog</h1>

        <div className="flex items-center gap-4">
          <Link
            href={`/admin/employees/${employeeId}/edit`}
            className="underline"
          >
            Izmeni
          </Link>

          <Link href="/admin/employees" className="underline">
            Nazad na listu
          </Link>
        </div>
      </div>

      {/* OSNOVNI PODACI */}
      <div className="border rounded p-4 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xl font-semibold">{employee.name}</div>
            <div className="opacity-80 text-sm">{employee.email}</div>
            {employee.phone && (
              <div className="opacity-80 text-sm">{employee.phone}</div>
            )}
          </div>
          <div className="text-sm opacity-70">{employee.jobTitle}</div>
        </div>
      </div>

      {/* USLUGE */}
      <div className="border rounded p-4 mb-6">
        <div className="font-semibold mb-2">Usluge</div>
        {services.length ? (
          <ul className="list-disc pl-5 space-y-1 opacity-90">
            {services.map((s) => (
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
      <div className="border rounded p-4">
        <div className="font-semibold mb-2">Smene</div>
        {shifts.length ? (
          <ul className="space-y-2">
            {shifts.map((sh) => (
              <li key={sh.id} className="border rounded p-3">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span className="font-semibold">{sh.date}</span>
                  <span>
                    {sh.startTime}–{sh.endTime}
                  </span>
                  {sh.breakStart && sh.breakEnd && (
                    <span className="opacity-80">
                      Pauza: {sh.breakStart}–{sh.breakEnd}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="opacity-70">Nema unetih smena.</p>
        )}
      </div>
    </div>
  );
}