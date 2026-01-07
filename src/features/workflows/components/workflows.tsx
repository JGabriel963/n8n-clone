"use client";

import { boolean } from "zod";
import { useSuspenseWorkflows } from "../hooks/use-workflow";
import { EntityContainer, EntityHeader } from "@/components/entitiy-components";

export const WorkflowList = () => {
  const workflows = useSuspenseWorkflows();

  return <p>{JSON.stringify(workflows, null, 2)}</p>;
};

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <>
      <EntityHeader
        title="Workflows"
        description="Create and manage your workflows"
        disabled={disabled}
        onNew={() => {}}
        newButtonLabel="New Workflow"
        isCreating={false}
      />
    </>
  );
};

export const WorkflowsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<></>}
      pagination={<></>}
    >
      {children}
    </EntityContainer>
  );
};
