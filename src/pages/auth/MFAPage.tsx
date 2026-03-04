import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MFAPage() {
  const navigate = useNavigate();
  const { verifyMfa, logout, pendingMfaUserId } = useAuthStore();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shakeCode, setShakeCode] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!pendingMfaUserId) {
      navigate("/auth/login");
    }
    inputRefs.current[0]?.focus();
  }, [pendingMfaUserId, navigate]);

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // Auto-submit when complete
    if (newCode.every((d) => d !== "") && newCode.join("").length === 6) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (fullCode?: string) => {
    const finalCode = fullCode ?? code.join("");
    if (finalCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    setIsLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 500));
    const success = verifyMfa(finalCode);
    setIsLoading(false);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid code. Try 123456 or any code starting with 1.");
      setShakeCode(true);
      setCode(["", "", "", "", "", ""]);
      setTimeout(() => {
        setShakeCode(false);
        inputRefs.current[0]?.focus();
      }, 400);
    }
  };

  const handleCancel = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#1A1D23] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary border border-primary/30 mb-4">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Two-Factor Authentication
          </h1>
          <p className="text-blue-200/70 text-sm mt-1">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 shadow-2xl">
          <div className="mb-4 rounded-xl bg-blue-500/20 border border-blue-400/30 p-3 text-xs text-blue-200">
            <span className="font-semibold text-blue-100">Demo: </span>
            Enter <code className="bg-blue-400/20 px-1 rounded">123456</code> or
            any code starting with 1 to proceed.
          </div>

          <div
            className={cn(
              "flex justify-center gap-2 mb-6",
              shakeCode && "animate-shake",
            )}
          >
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                value={digit}
                onChange={(e) => handleInput(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                maxLength={1}
                inputMode="numeric"
                className={cn(
                  "w-11 h-13 text-center text-xl font-bold text-white bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors",
                  digit && "border-primary/50 bg-primary/10",
                )}
              />
            ))}
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/20 p-3 text-xs text-red-200 border border-red-400/30">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Button
              onClick={() => handleVerify()}
              className="w-full bg-primary hover:bg-primary-hover"
              disabled={isLoading || code.some((d) => !d)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="w-full text-white/60 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
