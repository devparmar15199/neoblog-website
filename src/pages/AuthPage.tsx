import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      <LoadingSpinner size="lg" />;
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-10">
      <Card className="w-full max-w-md h-fit py-4 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp
              ? "Join the community to start sharing your thoughts."
              : "Sign in below to continue your journey."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSignUp ? (
            <RegisterForm onToggleSignIn={() => setIsSignUp(false)} />
          ) : (
            <LoginForm onToggleSignUp={() => setIsSignUp(true)} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
