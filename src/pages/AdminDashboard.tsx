import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AdminPostManager } from "./AdminPostManager";
import { AdminUserList } from "./AdminUserList";
import { AdminTaxonomyManager } from "./AdminTaxonomyManager";
import { Users, FileText, Tags } from "lucide-react";
import toast from "react-hot-toast";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!authLoading && profile?.role !== 'admin') {
      toast.error("You do not have permission to access this page.");
      navigate("/");
    }
  }, [profile, authLoading, navigate]);

  if (authLoading || !profile) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 space-y-8">
      <h1 className="text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">
            <Users className="size-4 mr-2" />
            Manage Users
          </TabsTrigger>
          <TabsTrigger value="posts">
            <FileText className="size-4 mr-2" />
            Manage Posts
          </TabsTrigger>
          <TabsTrigger value="taxonomies">
            <Tags className="size-4 mr-2" />
            Manage Taxonomies
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View, edit roles, or delete users from the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminUserList />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>Post Management</CardTitle>
              <CardDescription>View, edit, or delete any post on the system, including drafts.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminPostManager />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Taxonomies (Categories & Tags) Tab */}
        <TabsContent value="taxonomies">
          <Card>
            <CardHeader>
              <CardTitle>Taxonomy Management</CardTitle>
              <CardDescription>Create, edit, or delete post categories and tags.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminTaxonomyManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
