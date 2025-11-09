import { AuthLayout } from "@/features/auth/components/auth-layout";

import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
