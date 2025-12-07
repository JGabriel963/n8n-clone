"use client";

import { useTRPC } from "@/trpc/client";

export default function Page() {
  const trpc = useTRPC();
  return <div>page</div>;
}
