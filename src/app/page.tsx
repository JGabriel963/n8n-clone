import { Button } from "@/components/ui/button";
import Image from "next/image";

/**
 * Renders a full-screen centered container with a Button labeled "Click me".
 *
 * @returns A React element containing a full-height, full-width centered wrapper with the `Button` child.
 */
export default function Home() {
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <Button>Click me</Button>
    </div>
  );
}