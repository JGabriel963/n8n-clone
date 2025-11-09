import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { ButtonLogout } from "./logout";

export default async function Home() {
  await requireAuth();

  const data = await caller.getUsers();

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center">
      {JSON.stringify(data, null, 2)}
      <ButtonLogout />
    </div>
  );
}
