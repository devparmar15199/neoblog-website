import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

interface LoginFormProps {
  onToggleSignUp: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      toast.success("Signed in successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Sign-in failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <div>
        <Label htmlFor="login-email" className="mb-2 font-bold text-md">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12"
        />
      </div>

      {/* Password Input */}
      <div>
        <Label htmlFor="login-password" className="mb-2 font-bold text-md">Password</Label>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pr-10 h-12"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-0 h-full hover:bg-transparent"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4 text-muted-foreground" /> : <Eye className="size-4 text-muted-foreground" />}
          </Button>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || !email || !password}
        className="w-full h-12"
      >
        {isSubmitting ? <LoadingSpinner size="sm" /> : "Sign In"}
      </Button>

      {/* Switch to Sign Up */}
      <p className="pt-2 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Button
          type="button"
          variant="link"
          className="p-0 h-auto text-primary hover:text-primary/80"
          onClick={onToggleSignUp}
        >
          Create one here
        </Button>
      </p>
    </form>
  );
};
