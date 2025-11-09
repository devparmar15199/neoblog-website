import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) return;

    setIsSubmitting(true);
    try {
      await signUp(email, password, username);
      toast.success("Account created! Please sign in.");
      onSwitchToLogin();
    } catch (error: any) {
      const msg = error.message.includes("duplicate")
        ? "Username or email already taken."
        : "Registration failed. Try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Username Input */}
      <div className="space-y-2">
        <Label htmlFor="register-username" className="mb-2 font-semibold">Username</Label>
        <Input
          id="register-username"
          type="text"
          placeholder="johndoe"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoFocus
          className="h-11 text-base"
        />
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <Label htmlFor="register-email" className="mb-2 font-semibold">Email</Label>
        <Input
          id="register-email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-11 text-base"
        />
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <Label htmlFor="register-password" className="mb-2 font-semibold">Password</Label>
        <div className="relative">
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
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
        variant="default"
        disabled={isSubmitting || !username || !email || !password}
        className="w-full h-12 text-base font-semibold transition-all duration-200"
      >
        {isSubmitting ? <LoadingSpinner size="sm" /> : "Create Account"}
      </Button>

      {/* Switch to Sign In */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Button
          type="button"
          variant="link"
          className="p-0 font-medium text-primary hover:text-primary/90"
          onClick={onSwitchToLogin}
        >
          Sign In
        </Button>
      </p>
    </form>
  );
};
