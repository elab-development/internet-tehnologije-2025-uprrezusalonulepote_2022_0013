import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="max-w-5xl mx-auto p-4 flex gap-6">
        <Link href="/services">Usluge</Link>
        <Link href="/appointments">Termini</Link>
        <Link href="/admin">Admin</Link>
        <Link href="/login">Login</Link>
        <Link href="/register">Registracija</Link>
      </div>
    </nav>
  );
}