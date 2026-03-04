import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    setSubmittedEmail(data.email);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#1A1D23] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white font-bold text-2xl mb-4 shadow-lg shadow-primary/30">
            S
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-blue-200/70 text-sm mt-1">
            {sent
              ? "Check your inbox"
              : "Enter your email to receive a reset link"}
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 shadow-2xl">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <h2 className="text-white font-semibold mb-2">Email Sent!</h2>
              <p className="text-blue-200/70 text-sm mb-6">
                If{" "}
                <span className="text-white font-medium">{submittedEmail}</span>{" "}
                is registered, a reset link has been sent.
              </p>
              <p className="text-xs text-blue-200/50 mb-4">
                This is a demo — no email is actually sent in this prototype.
              </p>
              <Link to="/auth/login">
                <Button className="w-full bg-primary hover:bg-primary-hover">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-white/80 text-xs">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="your.name@school.ac.uk"
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-white/40"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-300 text-xs">{errors.email.message}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
              <Link
                to="/auth/login"
                className="flex items-center justify-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors mt-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
