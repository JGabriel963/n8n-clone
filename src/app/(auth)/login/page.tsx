import { LoginForm } from "@/features/auth/components/login-form";
import { requireUnauth } from "@/lib/auth-utils";
import React from "react";

export default async function LoginPage() {
  await requireUnauth();
  return (
    <div>
      <LoginForm />
    </div>
  );
}
