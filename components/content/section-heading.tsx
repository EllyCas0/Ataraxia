import type { ReactNode } from "react";

export function SectionHeading({ title, action, id }: { title: string; action?: ReactNode; id?: string }) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2 id={id} className="text-2xl text-foreground">
        {title}
      </h2>
      {action}
    </div>
  );
}
