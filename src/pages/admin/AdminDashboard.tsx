import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Users, FileText, Activity } from "lucide-react";

export const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">+1 hour ago</p>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground">


        [Image of Chart: User Growth Over Time]

        <p className="mt-2">Detailed analytics integration coming soon.</p>
      </div>
    </div>
  );
}
