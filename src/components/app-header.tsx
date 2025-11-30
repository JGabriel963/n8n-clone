import { SidebarTrigger } from "./ui/sidebar";

export const AppHeader = () => {
  return (
    <header className="flex h-14 shrink-0 items-center px-4 gap-2 bg-background">
      <SidebarTrigger />
    </header>
  );
};
