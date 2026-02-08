/* "use client";

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
} */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authRegister } from "@/lib/auth.client";

type Kind = "KLIJENT" | "ZAPOSLENI";

export default function RegisterPage() {
  const router = useRouter();

  const [kind, setKind] = useState<Kind>("KLIJENT");

  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // KLIJENT fields
  const [brTelefona, setBrTelefona] = useState("");
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [adresa, setAdresa] = useState("");

  // ZAPOSLENI fields
  const [radnoMestoId, setRadnoMestoId] = useState<number>(1);
  const [role, setRole] = useState<"ADMIN" | "ZAPOSLENI">("ZAPOSLENI");

  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: any) {
    e.preventDefault();
    setErr(null);

    try {
      if (kind === "KLIJENT") {
        await authRegister({
          kind: "KLIJENT",
          ime,
          prezime,
          email,
          password,
          brTelefona,
          korisnickoIme,
          adresa: adresa || undefined,
        });
      } else {
        await authRegister({
          kind: "ZAPOSLENI",
          ime,
          prezime,
          email,
          password,
          radnoMestoId,
          role,
        });
      }
      router.refresh();
      router.push("/services");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Greška");
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registracija</h1>

      {err && <div className="border p-3 rounded mb-3">{err}</div>}

      {/* izbor tipa */}
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="kind"
            checked={kind === "KLIJENT"}
            onChange={() => setKind("KLIJENT")}
          />
          Klijent
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="kind"
            checked={kind === "ZAPOSLENI"}
            onChange={() => setKind("ZAPOSLENI")}
          />
          Zaposleni
        </label>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          value={ime}
          onChange={(e) => setIme(e.target.value)}
          placeholder="Ime"
          className="border p-2 w-full rounded"
        />
        <input
          value={prezime}
          onChange={(e) => setPrezime(e.target.value)}
          placeholder="Prezime"
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
          placeholder="Lozinka (min 8)"
          type="password"
          className="border p-2 w-full rounded"
        />

        {/* KLIJENT polja */}
        {kind === "KLIJENT" && (
          <>
            <input
              value={brTelefona}
              onChange={(e) => setBrTelefona(e.target.value)}
              placeholder="Broj telefona"
              className="border p-2 w-full rounded"
            />
            <input
              value={korisnickoIme}
              onChange={(e) => setKorisnickoIme(e.target.value)}
              placeholder="Korisničko ime"
              className="border p-2 w-full rounded"
            />
            <input
              value={adresa}
              onChange={(e) => setAdresa(e.target.value)}
              placeholder="Adresa (opciono)"
              className="border p-2 w-full rounded"
            />
          </>
        )}

        {/* ZAPOSLENI polja */}
        {kind === "ZAPOSLENI" && (
          <>
            <input
              value={String(radnoMestoId)}
              onChange={(e) => setRadnoMestoId(Number(e.target.value))}
              placeholder="Radno mesto ID (npr. 1)"
              className="border p-2 w-full rounded"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "ADMIN" | "ZAPOSLENI")}
              className="border p-2 w-full rounded"
            >
              <option value="ZAPOSLENI">Zaposleni</option>
              <option value="ADMIN">Admin</option>
            </select>
          </>
        )}

        <button className="w-full bg-black text-white p-2 rounded">
          Registruj se
        </button>
      </form>
    </div>
  );
}