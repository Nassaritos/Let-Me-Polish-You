"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function RetryButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button type="button" onClick={() => start(() => router.refresh())} disabled={pending} className={`btn btn-red ${className}`}>
      {pending ? "Trying again…" : "Try again"}
    </button>
  );
}
