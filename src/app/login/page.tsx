"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authLogin } from "@/lib/auth.client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@mail.com");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    console.log("LOGIN SUBMIT");
    e.preventDefault();
    setErr(null);
    try {
      await authLogin(email, password);
      router.push("/services");
    } catch (e: any) {
      setErr(e?.message ?? "Greška");
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      {err && <div className="border p-3 rounded mb-3">{err}</div>}

      <form onSubmit={onSubmit} className="space-y-3">
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
        <button type="submit" className="w-full bg-black text-white p-2 rounded">
          Uloguj se
        </button>
      </form>
    </div>
  );
}