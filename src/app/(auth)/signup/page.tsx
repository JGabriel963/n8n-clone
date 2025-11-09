import { RegisterForm } from "@/features/auth/components/register-form";
import { requireUnauth } from "@/lib/auth-utils";
import React from "react";

export default async function Page() {
  await requireUnauth();
  return <RegisterForm />;
}
