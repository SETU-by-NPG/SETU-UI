import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Copy, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function MFASetupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"qr" | "verify" | "done">("qr");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const secretKey = "JBSWY3DPEHPK3PXP";

  const handleCopy = () => {
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError("Enter a 6-digit code");
      return;
    }
    setIsLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 800));
    // In demo, any code starting with 1 works
    if (/^1\d{5}$/.test(code) || code === "123456") {
      setIsLoading(false);
      setStep("done");
    } else {
      setIsLoading(false);
      setError("Invalid code. Try 123456 or any code starting with 1.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#1A1D23] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary border border-primary/30 mb-4">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Set Up Two-Factor Auth
          </h1>
          <p className="text-blue-200/70 text-sm mt-1">
            Secure your account with an authenticator app
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 shadow-2xl">
          {step === "qr" && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="inline-block p-4 bg-white rounded-xl mb-4">
                  {/* QR code placeholder */}
                  <div className="w-40 h-40 bg-gray-800 rounded flex items-center justify-center text-white text-xs text-center p-4">
                    QR Code
                    <br />
                    (Mock for demo)
                    <br />
                    <br />
                    Scan with Google Authenticator or Authy
                  </div>
                </div>
                <p className="text-blue-200/70 text-sm">
                  Scan the QR code with your authenticator app, or enter the key
                  manually:
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 p-3">
                <code className="flex-1 text-white font-mono text-sm tracking-wider">
                  {secretKey}
                </code>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={handleCopy}
                  className="text-white/60 hover:text-white"
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button
                onClick={() => setStep("verify")}
                className="w-full bg-primary hover:bg-primary-hover"
              >
                I've Scanned the Code
              </Button>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                Skip for now
              </button>
            </div>
          )}

          {step === "verify" && (
            <div className="space-y-4">
              <p className="text-blue-200/70 text-sm text-center">
                Enter the 6-digit code from your authenticator app to verify
                setup.
              </p>
              <div className="space-y-1.5">
                <Label className="text-white/80 text-xs">
                  Verification Code
                </Label>
                <Input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setError(null);
                  }}
                  placeholder="000000"
                  maxLength={6}
                  inputMode="numeric"
                  className="bg-white/10 border-white/20 text-white text-center text-xl tracking-widest font-mono placeholder:text-white/20"
                />
                {error && <p className="text-red-300 text-xs">{error}</p>}
              </div>
              <Button
                onClick={handleVerify}
                className="w-full bg-primary hover:bg-primary-hover"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  "Verify & Enable"
                )}
              </Button>
            </div>
          )}

          {step === "done" && (
            <div className="text-center py-4">
              <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <h2 className="text-white font-semibold mb-2">MFA Enabled!</h2>
              <p className="text-blue-200/70 text-sm mb-6">
                Two-factor authentication is now active on your account.
              </p>
              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-primary hover:bg-primary-hover"
              >
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
