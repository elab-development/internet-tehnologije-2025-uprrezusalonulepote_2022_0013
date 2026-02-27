"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authMe } from "@/lib/auth.client";
import {
  addServiceToEmployee,
  getAllEmployeesFromApi,
  updateEmployeeApi,
} from "@/lib/employees.client";
import { EmployeeDto, ServiceDto, UserDto } from "@/shared/types";
import { getServices } from "@/lib/services.client";

type FormState = {
  name: string;
  email: string;
  jobTitle: EmployeeDto["jobTitle"];
};

export default function AdminEmployeeEditPage() {
  const params = useParams<{ id: string }>();
  const employeeId = useMemo(() => params?.id ?? "", [params]);
  const router = useRouter();

  const [servicesOptions, setServicesOptions] = useState<ServiceDto[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null,
  );
  const [serviceMessage, setServiceMessage] = useState<string | null>(null); // poruka za dodavanje usluge
  const [me, setMe] = useState<UserDto | null>(null);
  const [employee, setEmployee] = useState<EmployeeDto | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    jobTitle: "FRIZER",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      const current = await authMe();
      setMe(current);

      if (current?.role === "ADMIN") {
        const all = await getAllEmployeesFromApi();
        const found = all.find((e) => e.id === employeeId) ?? null;
        setEmployee(found);

        if (found) {
          setForm({
            name: found.name,
            email: found.email,
            jobTitle: found.jobTitle,
          });
        }

        const allServices = await getServices();
        setServicesOptions(allServices);
      }

      setLoading(false);
    }

    run();
  }, [employeeId]);

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!employee) return;

    try {
      await updateEmployeeApi(employeeId, {
        name: form.name,
        email: form.email,
        jobTitle: form.jobTitle,
        role: employee.role,
      });

      alert("Sačuvano");
      router.push(`/admin/employees/${employeeId}`);
    } catch (err) {
      console.error(err);
      alert("Greška pri čuvanju zaposlenog.");
    }
  }

  if (loading) return <p>Učitavanje...</p>;
  if (!me || me.role !== "ADMIN") return <p>Nemaš pristup</p>;
  if (!employee) return <p>Zaposleni nije pronađen</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Izmena zaposlenog</h1>

      <form onSubmit={onSubmit} className="border rounded p-4 space-y-4">
        {/* Ime i email */}
        <div>
          <label>Ime i prezime</label>
          <input
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Dodavanje usluge */}
        <div>
          <label>Dodaj poziciju / uslugu</label>
          <div className="flex gap-2 mt-1">
            <select
              value={selectedServiceId ?? ""}
              onChange={(e) => setSelectedServiceId(Number(e.target.value))}
              className="flex-1 border rounded px-3 py-2"
            >
              <option value="">Izaberi uslugu</option>
              {servicesOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={async () => {
                if (!selectedServiceId || !employee) return;

                try {
                  const result = await addServiceToEmployee(
                    employee.id,
                    selectedServiceId,
                  );

                  if (!result.ok) {
                    // Poruka ako usluga već postoji
                    setServiceMessage(
                      result.message || "Greška pri dodavanju usluge.",
                    );
                  } else {
                    setServiceMessage(
                      "Usluga je uspešno dodeljena zaposlenom!",
                    );
                    setSelectedServiceId(null); // reset dropdown
                  }
                } catch (err) {
                  console.error(err);
                  setServiceMessage("Greška pri dodavanju usluge.");
                }
              }}
              className="border rounded px-4 py-2"
            >
              Dodaj
            </button>
          </div>

          {/* Prikaz poruke korisniku */}
          {serviceMessage && (
            <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded">
              {serviceMessage}
            </div>
          )}
        </div>

        {/* Dugme za čuvanje osnovnih podataka */}
        <div className="flex gap-3 mt-4">
          <button type="submit" className="border rounded px-4 py-2">
            Sačuvaj
          </button>
          <Link
            href={`/admin/employees/${employeeId}`}
            className="underline text-sm flex items-center px-2 py-2"
          >
            Otkaži
          </Link>
        </div>
      </form>
    </div>
  );
}
