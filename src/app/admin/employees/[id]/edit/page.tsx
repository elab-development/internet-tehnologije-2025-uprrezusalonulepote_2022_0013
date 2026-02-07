"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authMe } from "@/lib/auth.client";
import { getAllEmployees } from "@/lib/employees.client";
import { EmployeeDto, UserDto } from "@/shared/types";

type FormState = {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
};

export default function AdminEmployeeEditPage() {
  const params = useParams<{ id: string }>();
  const employeeId = useMemo(() => params?.id ?? "", [params]);
  const router = useRouter();

  const [me, setMe] = useState<UserDto | null>(null);
  const [employee, setEmployee] = useState<EmployeeDto | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      const current = await authMe();
      setMe(current);

      if (current?.role === "ADMIN") {
        const all = await getAllEmployees();
        const found = all.find((e) => e.id === employeeId) ?? null;
        setEmployee(found);

        if (found) {
          setForm({
            name: found.name ?? "",
            email: found.email ?? "",
            phone: found.phone ?? "",
            jobTitle: found.jobTitle ?? "",
          });
        }
      }

      setLoading(false);
    }

    run();
  }, [employeeId]);

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log("EDIT EMPLOYEE SUBMIT", { id: employeeId, ...form });

    alert("Sačuvano (mock) — vidi console.log");
    router.push(`/admin/employees/${employeeId}`);
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Izmena zaposlenog</h1>
        <p>Učitavanje...</p>
      </div>
    );
  }

  if (!me || me.role !== "ADMIN") {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Izmena zaposlenog</h1>
        <p>Nemaš pristup.</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold">Izmena zaposlenog</h1>
          <Link href="/admin/employees" className="underline">
            Nazad na listu
          </Link>
        </div>
        <p>Zaposleni nije pronađen.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Izmena zaposlenog</h1>
        <Link href={`/admin/employees/${employeeId}`} className="underline">
          Nazad na detalj
        </Link>
      </div>

      <form onSubmit={onSubmit} className="border rounded p-4 space-y-4">
        <div>
          <label className="block text-sm opacity-80 mb-1">Ime i prezime</label>
          <input
            className="w-full border rounded px-3 py-2 bg-transparent"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="npr. Jovana Frizer"
            required
          />
        </div>

        <div>
          <label className="block text-sm opacity-80 mb-1">Email</label>
          <input
            className="w-full border rounded px-3 py-2 bg-transparent"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="npr. jovana@salon.com"
            type="email"
            required
          />
        </div>

        <div>
          <label className="block text-sm opacity-80 mb-1">Telefon</label>
          <input
            className="w-full border rounded px-3 py-2 bg-transparent"
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="npr. 060123123"
          />
        </div>

        <div>
          <label className="block text-sm opacity-80 mb-1">Pozicija</label>
          <input
            className="w-full border rounded px-3 py-2 bg-transparent"
            value={form.jobTitle}
            onChange={(e) => onChange("jobTitle", e.target.value)}
            placeholder="npr. FRIZER / SMINKER"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="border rounded px-4 py-2" type="submit">
            Sačuvaj (mock)
          </button>

          <Link
            href={`/admin/employees/${employeeId}`}
            className="underline text-sm"
          >
            Otkaži
          </Link>
        </div>
      </form>
    </div>
  );
}