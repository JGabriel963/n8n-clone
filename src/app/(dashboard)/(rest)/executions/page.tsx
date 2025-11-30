import { requireAuth } from "@/lib/auth-utils";
import React from "react";

export default async function Page() {
  await requireAuth();
  return <div>Executions</div>;
}
