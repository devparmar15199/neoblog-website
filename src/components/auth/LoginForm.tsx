import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    try {
      await signIn(email, password);
      toast.success("Welcome back!");
    } catch (error: any) {
      const msg = error.message.includes("Invalid")
        ? "Invalid email or password."
        : "Sign in failed. Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email Input */}
      <div className="space-y-2">
        <Label htmlFor="login-email" className="mb-2 font-semibold">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
          className="h-11 text-base"
        />
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <Label htmlFor="login-password" className="mb-2 font-semibold">Password</Label>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pr-11 h-11 text-base"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || !email || !password}
        className="w-full h-12 text-base font-semibold transition-all duration-200"
      >
        {isSubmitting ? <LoadingSpinner size="sm" /> : "Sign In"}
      </Button>

      {/* Switch to Sign Up */}
      <p className="pt-2 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Button
          type="button"
          variant="link"
          className="p-0 h-auto font-medium text-primary hover:text-primary/90"
          onClick={onSwitchToRegister}
        >
          Create one here
        </Button>
      </p>
    </form>
  );
};
