import { Card, CardContent, CardHeader } from "../ui/Card";

export const PostCardSkeleton = () => {
  return (
    <Card className="overflow-hidden shadow-lg h-full flex flex-col">
      <div className="aspect-video w-full bg-muted/50 animate-pulse">
        <CardHeader className="p-4 grow">
          <div className="h-4 w-1/3 bg-muted/50 rounded-md animate-pulse mb-3" />
          <div className="h-6 w-3/4 bg-muted/50 rounded-md animate-pulse" />
          <div className="h-12 w-full bg-muted/50 rounded-md animate-pulse mt-2" />
        </CardHeader>
        <CardContent>
          <div className="h-4 w-1/2 bg-muted/50 rounded-md animate-pulse" />
        </CardContent>
      </div>
    </Card>
  );
};
