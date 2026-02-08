import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-2xl font-semibold">Salon lepote</h1>

        <Link href="/appointments" className="underline">
          Termini
        </Link>

        <Link href="/services" className="underline">
          Usluge
        </Link>

        <Link href="/admin" className="underline">
          Admin
        </Link>
      </div>
    </div>
  );
}