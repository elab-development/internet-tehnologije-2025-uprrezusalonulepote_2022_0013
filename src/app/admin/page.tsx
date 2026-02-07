"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authMe } from "@/lib/auth.client";
import { getAllUsers } from "@/lib/admin.client";
import { UserDto } from "@/shared/types";

export default function AdminPage() {
  const [me, setMe] = useState<UserDto | null>(null);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      const current = await authMe();
      setMe(current);

      if (current?.role === "ADMIN") {
        const all = await getAllUsers();
        setUsers(all);
      }

      setLoading(false);
    }

    run();
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Admin</h1>
        <p>Učitavanje...</p>
      </div>
    );
  }

  if (!me || me.role !== "ADMIN") {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Admin</h1>
        <p>Nemaš pristup.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin panel</h1>

      <div className="mb-6">
        <Link href="/admin/employees" className="underline">
          Pregled zaposlenih
        </Link>
      </div>

      <ul className="space-y-3">
        {users.map((u) => (
          <li key={u.id} className="border p-4 rounded flex justify-between">
            <span>{u.name}</span>
            <span>{u.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}