import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(mode !== "register");

  useEffect(() => {
    setIsLogin(mode !== "register");
  }, [mode]);

  const toggleMode = () => {
    const newMode = isLogin ? "register" : "login";
    navigate(`/auth?mode=${newMode}`);
  };

  return (
    <div className="container flex h-[calc(100vh-80px)] items-center justify-center px-4">
      <Card className="w-full max-w-md border-border/60 shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            {isLogin ? "Welcome Back" : "Join NeoBlog"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your credentials to access your account"
              : "Create an account to start sharing your ideas"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLogin ? (
            <LoginForm onSwitchToRegister={toggleMode} />
          ) : (
            <RegisterForm onSwitchToLogin={toggleMode} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};