import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export default function EmptyState({
  action,
  description,
  title,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center px-4 py-10 text-center">
        <p className="text-base font-medium">{title}</p>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
        {action ? <div className="mt-5">{action}</div> : null}
      </CardContent>
    </Card>
  );
}

export function EmptyStateAction({
  children,
}: {
  children: ReactNode;
}) {
  return <Button asChild>{children}</Button>;
}
