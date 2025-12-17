import { useSuspenseWorkflows } from "../hooks/use-workflow";

export const WorkflowList = () => {
  const workflows = useSuspenseWorkflows();

  return <p>{JSON.stringify(workflows, null, 2)}</p>;
};
