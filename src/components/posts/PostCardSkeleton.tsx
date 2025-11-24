import { Card, CardContent, CardFooter, CardHeader } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";

export const PostCardSkeleton = () => {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      {/* Cover Image Skeleton */}
      <div className="w-full h-48 bg-muted animate-pulse" />

      <CardHeader className="p-5 pb-2 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
      </CardHeader>

      <CardContent className="p-5 pt-0 grow space-y-2 mt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />

        <div className="flex gap-2 mt-4">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </CardContent>

      <CardFooter className="p-4 border-t flex justify-between">
        <Skeleton className="h-4 w-24" />
      </CardFooter>
    </Card>
  );
};
