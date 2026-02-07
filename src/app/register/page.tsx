"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authRegister } from "@/lib/auth.client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    try {
      await authRegister(name, email, password);
      router.push("/services");
    } catch (e) {
      if (e instanceof Error) setErr(e.message);
      else setErr("Greška");
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registracija</h1>

      {err && <div className="border p-3 rounded mb-3">{err}</div>}

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ime"
          className="border p-2 w-full rounded"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 w-full rounded"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Lozinka"
          type="password"
          className="border p-2 w-full rounded"
        />
        <button className="w-full bg-black text-white p-2 rounded">
          Registruj se
        </button>
      </form>
    </div>
  );
}