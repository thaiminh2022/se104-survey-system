import { SiteHeader } from "@/components/ui/dashboard/site-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <SiteHeader header="Surveys" />
      <div className="mx-auto w-3/4 lg:w-1/2">
        <div className="my-3 flex items-center justify-between gap-4">
          <Skeleton className="h-9 w-44 rounded-md" />
          <Skeleton className="hidden h-9 w-28 rounded-md sm:block" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Skeleton className="h-5 w-40 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-2/3 rounded-md" />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Skeleton className="size-9 rounded-md" />
                  <Skeleton className="size-9 rounded-md" />
                  <Skeleton className="size-9 rounded-md" />
                  <Skeleton className="h-9 w-28 rounded-md" />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
