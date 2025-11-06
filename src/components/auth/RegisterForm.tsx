import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

interface RegisterFormProps {
  onToggleSignIn: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleSignIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signUp(email, password, username);
      toast.success("Successfully registered! You can now sign in.");
      navigate("/");
    } catch (error) {
      toast.error("Registration failed. This username or email may already be in use.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Username Input */}
      <div>
        <Label htmlFor="register-username" className="mb-2 font-bold text-md">Username</Label>
        <Input
          id="register-username"
          type="text"
          placeholder="johndoe"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="h-12"
        />
      </div>

      {/* Email Input */}
      <div>
        <Label htmlFor="register-email" className="mb-2 font-bold text-md">Email</Label>
        <Input
          id="register-email"
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
        <Label htmlFor="register-password" className="mb-2 font-bold text-md">Password</Label>
        <div className="relative">
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
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
        variant="secondary"
        disabled={isSubmitting || !email || !password || !username}
        className="w-full h-12"
      >
        {isSubmitting ? <LoadingSpinner size="sm" /> : "Sign Up"}
      </Button>

      {/* Switch to Sign In */}
      <p className="pt-2 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Button
          type="button"
          variant="link"
          className="p-0 h-auto text-primary hover:text-primary/80"
          onClick={onToggleSignIn}
        >
          Sign In
        </Button>
      </p>
    </form>
  );
};
