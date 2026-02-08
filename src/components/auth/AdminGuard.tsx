"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authMe } from "@/lib/auth.client";
import { UserDto } from "@/shared/types";

type Props = { children: ReactNode };

export default function AdminGuard({ children }: Props) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const user: UserDto | null = await authMe();
        if (!alive) return;

        if (user && user.role === "ADMIN") {
          setAllowed(true);
          return;
        }

        setAllowed(false);
        router.replace("/appointments");
      } catch {
        if (!alive) return;
        setAllowed(false);
        router.replace("/login");
      }
    })();

    return () => {
      alive = false;
    };
  }, [router]);

  if (allowed === null) return <div className="p-6">Učitavanje...</div>;
  if (!allowed) return null;

  return <>{children}</>;
}