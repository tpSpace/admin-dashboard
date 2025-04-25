import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <Skeleton className="h-5 w-3/5" />
          <Skeleton className="h-5 w-1/5" />
        </div>
        <Skeleton className="h-4 w-full mt-3" />
        <Skeleton className="h-4 w-4/5 mt-1" />
        <Skeleton className="h-4 w-1/4 mt-3" />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}
