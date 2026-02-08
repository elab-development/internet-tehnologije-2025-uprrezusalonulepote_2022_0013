"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authLogout, authMe } from "@/lib/auth.client";
import { UserDto } from "@/shared/types";
import { useRouter } from "next/navigation";

export default function NavbarClient() {
  const [me, setMe] = useState<UserDto | null>(null);
  const router = useRouter();

  useEffect(() => {
    authMe().then(setMe).catch(() => setMe(null));
  }, []);

  async function onLogout() {
    await authLogout();
    setMe(null);
    router.push("/login");
  }

  return (
    <div className="ml-auto flex items-center gap-4">
      {me ? (
        <>
          <span className="text-sm text-gray-600">
            Ulogovan/a: <b>{me.name}</b> ({me.role})
          </span>
          <button onClick={onLogout} className="border px-3 py-1 rounded">
            Logout
          </button>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Registracija</Link>
        </>
      )}
    </div>
  );
}