import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLocked, failedLoginAttempts } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shakeForm, setShakeForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setServerError(null);
    const result = await login(data.email, data.password);
    setIsLoading(false);

    if (result.success) {
      if (result.requiresMfa) {
        navigate("/auth/mfa");
      } else {
        navigate("/dashboard");
      }
    } else {
      setServerError(result.error ?? "Login failed");
      setShakeForm(true);
      setTimeout(() => setShakeForm(false), 400);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#1A1D23] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div
        className={cn("relative w-full max-w-sm", shakeForm && "animate-shake")}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white font-bold text-2xl mb-4 shadow-lg shadow-primary/30">
            S
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome to SETU</h1>
          <p className="text-blue-200/70 text-sm mt-1">
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 shadow-2xl">
          {/* Demo credentials */}
          <div className="mb-5 rounded-xl bg-blue-500/20 border border-blue-400/30 p-3 text-xs text-blue-200">
            <div className="font-semibold mb-1 text-blue-100">
              Demo Credentials
            </div>
            <div>
              Any email from the demo list + password:{" "}
              <code className="bg-blue-400/20 px-1 rounded">setu1234</code>
            </div>
            <div className="mt-1 text-blue-300/70">
              e.g. s.whitfield@hartfield.ac.uk
            </div>
          </div>

          {/* Locked warning */}
          {isLocked && (
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-red-500/20 border border-red-400/30 p-3 text-xs text-red-200">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                Account temporarily locked after 5 failed attempts. Please wait
                15 minutes.
              </div>
            </div>
          )}

          {/* Failed attempts warning */}
          {!isLocked && failedLoginAttempts > 0 && failedLoginAttempts < 5 && (
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-amber-500/20 border border-amber-400/30 p-3 text-xs text-amber-200">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                {5 - failedLoginAttempts} attempt
                {5 - failedLoginAttempts !== 1 ? "s" : ""} remaining before
                account lock.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-white/80 text-xs">Email Address</Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="your.name@school.ac.uk"
                autoComplete="email"
                disabled={isLocked}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-white/40 focus-visible:border-white/40"
              />
              {errors.email && (
                <p className="text-red-300 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-white/80 text-xs">Password</Label>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs text-blue-300 hover:text-blue-200 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLocked}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-white/40 focus-visible:border-white/40 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-300 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            {serverError && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/20 p-3 text-xs text-red-200 border border-red-400/30">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30"
              disabled={isLoading || isLocked}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-white/30 mt-4">
          SETU Education Management System &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
