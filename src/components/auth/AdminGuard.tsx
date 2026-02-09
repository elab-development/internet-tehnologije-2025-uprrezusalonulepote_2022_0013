"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authMe } from "@/lib/auth.client";

export default function AdminGuard() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const user = await authMe();
      const isAdmin = user?.role === "ADMIN";

      if (!isAdmin) router.replace("/appointments");
    })();
  }, [router]);

  return null;
}