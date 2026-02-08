"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMockUser } from "@/lib/session.client";

type Props = {
  children: ReactNode;
};

export default function AdminGuard({ children }: Props) {
  const router = useRouter();

  useEffect(() => {
    const user = getMockUser();
    if (!user || user.role !== "ADMIN") {
      router.replace("/appointments");
    }
  }, [router]);

  return <>{children}</>;
}