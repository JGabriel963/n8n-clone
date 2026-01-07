import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { ErrorBoundary } from "react-error-boundary";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import {
  WorkflowList,
  WorkflowsContainer,
} from "@/features/workflows/components/workflows";

export default async function Page() {
  await requireAuth();

  prefetchWorkflows();

  return (
    <WorkflowsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<div>Error!</div>}>
          <Suspense fallback={<p>Loading...</p>}>
            <WorkflowList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowsContainer>
  );
}
