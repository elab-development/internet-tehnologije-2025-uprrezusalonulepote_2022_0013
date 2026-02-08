import Link from "next/link";
import NavbarClient from "@/components/layout/NavbarClient";

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="max-w-5xl mx-auto p-4 flex items-center gap-6">
        <Link href="/admin/services">Usluge</Link>
        <Link href="/appointments">Termini</Link>
        <Link href="/admin">Admin</Link>

        <NavbarClient />
      </div>
    </nav>
  );
}