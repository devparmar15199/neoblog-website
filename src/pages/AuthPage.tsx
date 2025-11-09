// AuthPage.tsx:
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { RootState } from "@/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const isRegister = searchParams.get("mode") === "register";
  // Select user, profile, and loading state
  const { user, profile, loading } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  // Redirect authenticated users
  useEffect(() => {
    // Only redirect if:
    // 1. User is present
    // 2. Profile is also loaded (or user is not loading and profile is null, meaning profile fetch failed or user is new)
    // 3. Global app loading is false
    if (user && profile && !loading) {
      navigate("/dashboard", { replace: true });
    }
  // The dependency array is crucial. We now check both user and profile.
  }, [user, profile, loading, navigate]); 

  // Show loading spinner during initial authentication check
  // if (loading) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <LoadingSpinner size="lg" />
  //     </div>
  //   );
  // }

  // If a user exists but profile is null (meaning profile fetch failed, or new user before profile write),
  // you might want to show an error or a completion page. For now, we assume if loading is false and user is null, 
  // they are unauthenticated.

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background to-muted/30 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-3 pb-6 pt-8">
          <CardTitle className="text-center text-3xl font-bold tracking-tight text-primary">
            {isRegister ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-center text-base">
            {isRegister
              ? "Start your journey with NeoBlog — share your voice."
              : "Sign in to continue writing and engaging with the community."}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8">
          {isRegister ? (
            <RegisterForm onSwitchToLogin={() => navigate("/auth")} />
          ) : (
            <LoginForm onSwitchToRegister={() => navigate("/auth?mode=register")} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};