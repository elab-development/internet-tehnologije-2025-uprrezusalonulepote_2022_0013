"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ServiceForm from "@/components/services/ServiceForm";
import { getServiceById } from "@/lib/services.client";
import { ServiceDto } from "@/shared/types";

export default function AdminServiceEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [service, setService] = useState<ServiceDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const s = await getServiceById(id);
      setService(s);
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  if (loading) return <div>Učitavanje...</div>;

  if (!service) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="mb-3">Usluga nije pronađena.</div>
        <Button onClick={() => router.push("/admin/services")}>Nazad</Button>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Izmena usluge</h1>

      <ServiceForm
        initial={service}
        onSaved={() => router.push("/admin/services")}
      />

      <Button onClick={() => router.push("/admin/services")}>Nazad</Button>
    </div>
  );
}