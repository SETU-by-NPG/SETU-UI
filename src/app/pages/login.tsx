import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  School,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Shield,
  Key,
  Smartphone,
  Mail,
  CheckCircle,
  Copy,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

// SSO Providers
const ssoProviders = [
  { id: "google", name: "Google", enabled: true, color: "#4285F4", icon: "G" },
  {
    id: "microsoft",
    name: "Microsoft",
    enabled: true,
    color: "#00A4EF",
    icon: "M",
  },
  {
    id: "azure",
    name: "Azure AD",
    enabled: false,
    color: "#0078D4",
    icon: "A",
  },
];

// Demo accounts grouped by role category
const demoAccountGroups = [
  {
    category: "Administrative",
    accounts: [
      {
        email: "james.smith@setu.edu",
        password: "admin123",
        role: "Master Admin",
        twoFactorEnabled: true,
      },
      {
        email: "principal@setu.edu",
        password: "admin123",
        role: "Principal",
        twoFactorEnabled: false,
      },
      {
        email: "it.admin@setu.edu",
        password: "admin123",
        role: "IT Admin",
        twoFactorEnabled: false,
      },
      {
        email: "finance@setu.edu",
        password: "admin123",
        role: "Finance Manager",
        twoFactorEnabled: false,
      },
    ],
  },
  {
    category: "Academic Leadership",
    accounts: [
      {
        email: "slt@setu.edu",
        password: "teacher123",
        role: "SLT Member",
        twoFactorEnabled: false,
      },
      {
        email: "sarah.mitchell@setu.edu",
        password: "teacher123",
        role: "Head of Department",
        twoFactorEnabled: false,
      },
      {
        email: "hoy@setu.edu",
        password: "teacher123",
        role: "Head of Year",
        twoFactorEnabled: false,
      },
      {
        email: "exams@setu.edu",
        password: "teacher123",
        role: "Examinations Officer",
        twoFactorEnabled: false,
      },
    ],
  },
  {
    category: "Teaching & Welfare",
    accounts: [
      {
        email: "jwilliams@setu.edu",
        password: "teacher123",
        role: "Teacher",
        twoFactorEnabled: false,
      },
      {
        email: "ta@setu.edu",
        password: "teacher123",
        role: "Teaching Assistant",
        twoFactorEnabled: false,
      },
      {
        email: "dsl@setu.edu",
        password: "teacher123",
        role: "Safeguarding Lead",
        twoFactorEnabled: false,
      },
      {
        email: "attendance@setu.edu",
        password: "teacher123",
        role: "Attendance Officer",
        twoFactorEnabled: false,
      },
    ],
  },
  {
    category: "Support & Specialist",
    accounts: [
      {
        email: "thurston.howell@setu.edu",
        password: "librarian123",
        role: "Librarian",
        twoFactorEnabled: false,
      },
      {
        email: "sci.tech@setu.edu",
        password: "librarian123",
        role: "Science Technician",
        twoFactorEnabled: false,
      },
      {
        email: "reception@setu.edu",
        password: "librarian123",
        role: "Support Staff",
        twoFactorEnabled: false,
      },
    ],
  },
  {
    category: "Students",
    accounts: [
      {
        email: "peter.santos@student.setu.edu",
        password: "student123",
        role: "Student",
        twoFactorEnabled: false,
      },
      {
        email: "student.leader@setu.edu",
        password: "student123",
        role: "Student Leadership",
        twoFactorEnabled: false,
      },
    ],
  },
  {
    category: "Parent",
    accounts: [
      {
        email: "heather.moran@email.com",
        password: "parent123",
        role: "Parent",
        twoFactorEnabled: false,
      },
    ],
  },
];

// Flat list for backward-compatible login logic
const demoAccounts = demoAccountGroups.flatMap((g) => g.accounts);

// Mock 2FA secret for demo
const mockTwoFactorSecret = "JBSWY3DPEHPK3PXP";
const recoveryCodes = [
  "A7X2-K9M3-N4P8",
  "B8Y3-L0N4-Q5R9",
  "C9Z4-M1O5-R6S0",
  "D0A5-N2P6-S7T1",
  "E1B6-O3Q7-T8U2",
  "F2C7-P4R8-U9V3",
];

type LoginStep =
  | "credentials"
  | "2fa"
  | "2fa-setup"
  | "2fa-recovery"
  | "forgot-password"
  | "reset-sent";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemoHint, setShowDemoHint] = useState(false);

  // Login step state
  const [loginStep, setLoginStep] = useState<LoginStep>("credentials");
  const [verificationCode, setVerificationCode] = useState("");
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const [recoveryCodeInput, setRecoveryCodeInput] = useState("");
  const [enteredRecoveryCodes, setEnteredRecoveryCodes] = useState<string[]>(
    [],
  );
  const [setup2FA, setSetup2FA] = useState(false);
  const [copiedRecovery, setCopiedRecovery] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<Date | null>(null);

  // Forgot password state
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Selected account for 2FA
  const [selectedAccount, setSelectedAccount] = useState<
    (typeof demoAccounts)[0] | null
  >(null);

  // Check if locked out
  useEffect(() => {
    if (lockedUntil && new Date() < lockedUntil) {
      const timer = setTimeout(() => {
        setLockedUntil(null);
        setFailedAttempts(0);
      }, lockedUntil.getTime() - Date.now());
      return () => clearTimeout(timer);
    }
  }, [lockedUntil]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check if locked out
    if (lockedUntil && new Date() < lockedUntil) {
      const remaining = Math.ceil((lockedUntil.getTime() - Date.now()) / 1000);
      setError(`Account locked. Try again in ${remaining} seconds.`);
      return;
    }

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const account = demoAccounts.find(
      (a) => a.email === email && a.password === password,
    );

    if (!account) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 5) {
        const lockUntil = new Date(Date.now() + 30 * 1000);
        setLockedUntil(lockUntil);
        setError("Too many failed attempts. Account locked for 30 seconds.");
      } else {
        setError(
          `Invalid email or password. ${5 - newAttempts} attempts remaining.`,
        );
      }
      return;
    }

    // Check if 2FA is enabled for this account
    if (account.twoFactorEnabled) {
      setSelectedAccount(account);
      setLoginStep("2fa");
      setLoading(false);
      return;
    }

    // No 2FA - complete login
    completeLogin(account);
  };

  const completeLogin = (account: (typeof demoAccounts)[0]) => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem(
        "setu_auth",
        JSON.stringify({ email: account.email, role: account.role }),
      );
      localStorage.setItem(
        "setu_2fa_enabled",
        JSON.stringify(account.twoFactorEnabled),
      );
      navigate("/");
    }, 800);
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (useRecoveryCode) {
      // Validate recovery code
      const validCode = recoveryCodes.find(
        (code) =>
          code === recoveryCodeInput || enteredRecoveryCodes.includes(code),
      );

      if (!validCode) {
        setError("Invalid recovery code. Please try again.");
        return;
      }

      if (!enteredRecoveryCodes.includes(validCode)) {
        setEnteredRecoveryCodes([...enteredRecoveryCodes, validCode]);
      }

      if (selectedAccount) {
        completeLogin(selectedAccount);
      }
      return;
    }

    // Accept any 6-digit code for demo (mock validation)
    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit code.");
      return;
    }

    // Mock validation - accept "123456" or any 6 digits for demo
    if (selectedAccount) {
      completeLogin(selectedAccount);
    }
  };

  const handleSSO = (providerId: string) => {
    const provider = ssoProviders.find((p) => p.id === providerId);
    if (!provider?.enabled) return;

    setLoading(true);
    setError("");
    setTimeout(() => {
      // SSO defaults to admin login with 2FA
      const account = demoAccounts[0]; // IT Administrator
      if (account.twoFactorEnabled) {
        setSelectedAccount(account);
        setLoginStep("2fa");
        setLoading(false);
      } else {
        localStorage.setItem(
          "setu_auth",
          JSON.stringify({ email: account.email, role: account.role }),
        );
        localStorage.setItem(
          "setu_2fa_enabled",
          JSON.stringify(account.twoFactorEnabled),
        );
        navigate("/");
      }
    }, 1000);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setError("Please enter your email address.");
      return;
    }
    // Mock send reset email
    setResetSent(true);
    setLoginStep("reset-sent");
  };

  const fillDemo = (account: (typeof demoAccounts)[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  };

  const goBack = () => {
    if (loginStep === "2fa") {
      setLoginStep("credentials");
      setVerificationCode("");
      setRecoveryCodeInput("");
      setSelectedAccount(null);
    } else if (loginStep === "2fa-setup") {
      setLoginStep("credentials");
    } else if (loginStep === "2fa-recovery") {
      setLoginStep("2fa");
    } else if (loginStep === "forgot-password") {
      setLoginStep("credentials");
    } else if (loginStep === "reset-sent") {
      setLoginStep("forgot-password");
      setResetSent(false);
    }
  };

  const copyRecoveryCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join("\n"));
    setCopiedRecovery(true);
    setTimeout(() => setCopiedRecovery(false), 2000);
  };

  const enable2FA = () => {
    setSetup2FA(true);
    setLoginStep("2fa-setup");
  };

  // Render 2FA verification screen
  if (loginStep === "2fa") {
    return (
      <div className="min-h-screen bg-background flex">
        {/* Left branding panel */}
        <div className="hidden lg:flex lg:w-[45%] bg-primary text-primary-foreground flex-col justify-between p-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <School className="w-6 h-6" />
              </div>
              <span style={{ fontSize: "1.5rem", fontWeight: 600 }}>SETU</span>
            </div>
            <p className="opacity-70 mt-1" style={{ fontSize: "0.875rem" }}>
              Education Management System
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: "2rem", fontWeight: 600, lineHeight: 1.3 }}>
              Two-Factor
              <br />
              Authentication
            </h2>
            <p
              className="mt-4 opacity-70 max-w-md"
              style={{ fontSize: "0.9375rem", lineHeight: 1.6 }}
            >
              Enter the 6-digit code from your authenticator app or use a
              recovery code.
            </p>
          </div>
          <p className="opacity-40" style={{ fontSize: "0.75rem" }}>
            &copy; 2026 SETU Academy. All rights reserved.
          </p>
        </div>

        {/* Right login form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-[400px]">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span style={{ fontSize: "0.875rem" }}>Back to login</span>
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                Verify it's you
              </h1>
            </div>

            <p
              className="text-muted-foreground mb-6"
              style={{ fontSize: "0.875rem" }}
            >
              Enter the 6-digit code from your authenticator app for{" "}
              {selectedAccount?.email}
            </p>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 mb-4">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p style={{ fontSize: "0.8125rem" }}>{error}</p>
              </div>
            )}

            <form onSubmit={handle2FASubmit} className="space-y-4">
              {!useRecoveryCode ? (
                <div>
                  <label style={{ fontSize: "0.875rem" }}>
                    Authentication Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(
                        e.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    placeholder="000000"
                    className="w-full mt-1 px-4 py-3 rounded-lg border border-border bg-input-background text-center tracking-[0.5em] font-mono"
                    style={{ fontSize: "1.25rem", letterSpacing: "0.3em" }}
                    maxLength={6}
                    autoComplete="one-time-code"
                    autoFocus
                  />
                  <p
                    className="text-muted-foreground mt-2"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Demo: Enter any 6-digit code (e.g., 123456)
                  </p>
                </div>
              ) : (
                <div>
                  <label style={{ fontSize: "0.875rem" }}>Recovery Code</label>
                  <input
                    type="text"
                    value={recoveryCodeInput}
                    onChange={(e) =>
                      setRecoveryCodeInput(e.target.value.toUpperCase())
                    }
                    placeholder="XXXX-XXXX-XXXX"
                    className="w-full mt-1 px-4 py-3 rounded-lg border border-border bg-input-background font-mono"
                    style={{ fontSize: "1rem" }}
                    maxLength={15}
                    autoFocus
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60"
                style={{ fontSize: "0.875rem" }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </button>
            </form>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  setUseRecoveryCode(!useRecoveryCode);
                  setError("");
                }}
                className="w-full text-center text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontSize: "0.8125rem" }}
              >
                {useRecoveryCode
                  ? "Use authenticator app code"
                  : "Use a recovery code instead"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render 2FA setup screen
  if (loginStep === "2fa-setup") {
    return (
      <div className="min-h-screen bg-background flex">
        {/* Left branding panel */}
        <div className="hidden lg:flex lg:w-[45%] bg-primary text-primary-foreground flex-col justify-between p-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <School className="w-6 h-6" />
              </div>
              <span style={{ fontSize: "1.5rem", fontWeight: 600 }}>SETU</span>
            </div>
            <p className="opacity-70 mt-1" style={{ fontSize: "0.875rem" }}>
              Education Management System
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: "2rem", fontWeight: 600, lineHeight: 1.3 }}>
              Set Up
              <br />
              Two-Factor
            </h2>
            <p
              className="mt-4 opacity-70 max-w-md"
              style={{ fontSize: "0.9375rem", lineHeight: 1.6 }}
            >
              Secure your account by adding an extra layer of protection.
            </p>
          </div>
          <p className="opacity-40" style={{ fontSize: "0.75rem" }}>
            &copy; 2026 SETU Academy. All rights reserved.
          </p>
        </div>

        {/* Right login form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-[400px]">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span style={{ fontSize: "0.875rem" }}>Back</span>
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                Set up 2FA
              </h1>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <h3
                className="font-medium mb-3"
                style={{ fontSize: "0.9375rem" }}
              >
                Scan this QR code
              </h3>
              <div className="bg-white p-4 rounded-lg border border-border flex items-center justify-center mb-4">
                {/* Mock QR Code */}
                <div className="w-40 h-40 bg-primary/10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Key className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p
                      className="text-muted-foreground"
                      style={{ fontSize: "0.6875rem" }}
                    >
                      QR Code
                    </p>
                  </div>
                </div>
              </div>
              <p
                className="text-muted-foreground mb-2"
                style={{ fontSize: "0.8125rem" }}
              >
                Or enter this key manually:
              </p>
              <div className="flex items-center gap-2 bg-background p-2 rounded border border-border">
                <code className="flex-1 font-mono text-sm">
                  {mockTwoFactorSecret}
                </code>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(mockTwoFactorSecret)
                  }
                  className="p-1 hover:bg-muted rounded"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3
                className="font-medium text-yellow-800 mb-2"
                style={{ fontSize: "0.875rem" }}
              >
                Save your recovery codes
              </h3>
              <p
                className="text-yellow-700 mb-3"
                style={{ fontSize: "0.8125rem" }}
              >
                These codes are the only way to access your account if you lose
                your device. Each code can only be used once.
              </p>
              <div className="bg-background rounded border border-border p-3 space-y-1">
                {recoveryCodes.map((code, i) => (
                  <code key={i} className="font-mono text-sm block">
                    {code}
                  </code>
                ))}
              </div>
              <button
                onClick={copyRecoveryCodes}
                className="mt-3 flex items-center gap-2 text-primary hover:underline"
                style={{ fontSize: "0.8125rem" }}
              >
                {copiedRecovery ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copiedRecovery ? "Copied!" : "Copy all codes"}
              </button>
            </div>

            <button
              onClick={() => {
                localStorage.setItem("setu_2fa_enabled", "true");
                const account = demoAccounts[0];
                localStorage.setItem(
                  "setu_auth",
                  JSON.stringify({ email: account.email, role: account.role }),
                );
                navigate("/");
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              style={{ fontSize: "0.875rem" }}
            >
              <CheckCircle className="w-4 h-4" />
              I've saved my codes - Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Forgot Password screen
  if (loginStep === "forgot-password") {
    return (
      <div className="min-h-screen bg-background flex">
        {/* Left branding panel */}
        <div className="hidden lg:flex lg:w-[45%] bg-primary text-primary-foreground flex-col justify-between p-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <School className="w-6 h-6" />
              </div>
              <span style={{ fontSize: "1.5rem", fontWeight: 600 }}>SETU</span>
            </div>
            <p className="opacity-70 mt-1" style={{ fontSize: "0.875rem" }}>
              Education Management System
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: "2rem", fontWeight: 600, lineHeight: 1.3 }}>
              Reset your
              <br />
              password
            </h2>
            <p
              className="mt-4 opacity-70 max-w-md"
              style={{ fontSize: "0.9375rem", lineHeight: 1.6 }}
            >
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>
          <p className="opacity-40" style={{ fontSize: "0.75rem" }}>
            &copy; 2026 SETU Academy. All rights reserved.
          </p>
        </div>

        {/* Right login form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-[400px]">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span style={{ fontSize: "0.875rem" }}>Back to login</span>
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                Forgot password?
              </h1>
            </div>

            <p
              className="text-muted-foreground mb-6"
              style={{ fontSize: "0.875rem" }}
            >
              No worries, we'll send you reset instructions.
            </p>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 mb-4">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p style={{ fontSize: "0.8125rem" }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label style={{ fontSize: "0.875rem" }}>Email</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@setu.edu"
                  className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input-background"
                  style={{ fontSize: "0.875rem" }}
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60"
                style={{ fontSize: "0.875rem" }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Reset password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Render Reset Email Sent screen
  if (loginStep === "reset-sent") {
    return (
      <div className="min-h-screen bg-background flex">
        {/* Left branding panel */}
        <div className="hidden lg:flex lg:w-[45%] bg-primary text-primary-foreground flex-col justify-between p-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <School className="w-6 h-6" />
              </div>
              <span style={{ fontSize: "1.5rem", fontWeight: 600 }}>SETU</span>
            </div>
            <p className="opacity-70 mt-1" style={{ fontSize: "0.875rem" }}>
              Education Management System
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: "2rem", fontWeight: 600, lineHeight: 1.3 }}>
              Check your
              <br />
              email
            </h2>
            <p
              className="mt-4 opacity-70 max-w-md"
              style={{ fontSize: "0.9375rem", lineHeight: 1.6 }}
            >
              We've sent a password reset link to your inbox.
            </p>
          </div>
          <p className="opacity-40" style={{ fontSize: "0.75rem" }}>
            &copy; 2026 SETU Academy. All rights reserved.
          </p>
        </div>

        {/* Right login form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-[400px] text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-green-600" />
            </div>

            <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
              Check your email
            </h1>

            <p
              className="text-muted-foreground mt-3 mb-6"
              style={{ fontSize: "0.875rem" }}
            >
              We sent a password reset link to
              <br />
              <span className="font-medium text-foreground">{resetEmail}</span>
            </p>

            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p
                className="text-muted-foreground"
                style={{ fontSize: "0.8125rem" }}
              >
                Didn't receive the email? Check your spam filter, or
                <button
                  onClick={() => {
                    setLoginStep("forgot-password");
                    setResetSent(false);
                  }}
                  className="text-primary hover:underline ml-1"
                >
                  try another email address
                </button>
              </p>
            </div>

            <button
              onClick={goBack}
              className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground mx-auto"
              style={{ fontSize: "0.875rem" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main login screen
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-primary text-primary-foreground flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <School className="w-6 h-6" />
            </div>
            <span style={{ fontSize: "1.5rem", fontWeight: 600 }}>SETU</span>
          </div>
          <p className="opacity-70 mt-1" style={{ fontSize: "0.875rem" }}>
            Education Management System
          </p>
        </div>
        <div>
          <h2 style={{ fontSize: "2rem", fontWeight: 600, lineHeight: 1.3 }}>
            Manage your school
            <br />
            with clarity.
          </h2>
          <p
            className="mt-4 opacity-70 max-w-md"
            style={{ fontSize: "0.9375rem", lineHeight: 1.6 }}
          >
            A unified platform for administrators, teachers, students, and
            parents. From attendance to analytics, everything in one place.
          </p>
        </div>
        <p className="opacity-40" style={{ fontSize: "0.75rem" }}>
          &copy; 2026 SETU Academy. All rights reserved.
        </p>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <School className="w-5 h-5 text-primary-foreground" />
            </div>
            <span style={{ fontSize: "1.25rem", fontWeight: 600 }}>SETU</span>
          </div>

          <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Sign in</h1>
          <p
            className="text-muted-foreground mt-1 mb-6"
            style={{ fontSize: "0.875rem" }}
          >
            Enter your credentials to access SETU.
          </p>

          {/* SSO Buttons */}
          <div className="space-y-2 mb-6">
            {ssoProviders.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleSSO(provider.id)}
                disabled={!provider.enabled || loading}
                className={`w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border transition-colors ${
                  provider.enabled
                    ? "border-border hover:bg-muted cursor-pointer"
                    : "border-border/50 opacity-40 cursor-not-allowed"
                }`}
                style={{ fontSize: "0.875rem" }}
              >
                <span
                  className="w-5 h-5 rounded-sm flex items-center justify-center text-white"
                  style={{
                    backgroundColor: provider.color,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  {provider.icon}
                </span>
                <span>Continue with {provider.name}</span>
                {!provider.enabled && (
                  <span
                    className="ml-auto text-muted-foreground"
                    style={{ fontSize: "0.6875rem" }}
                  >
                    Not configured
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span
              className="text-muted-foreground"
              style={{ fontSize: "0.75rem" }}
            >
              OR
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p style={{ fontSize: "0.8125rem" }}>{error}</p>
              </div>
            )}

            <div>
              <label style={{ fontSize: "0.875rem" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@setu.edu"
                className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input-background"
                style={{ fontSize: "0.875rem" }}
                autoComplete="email"
                disabled={lockedUntil !== null}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label style={{ fontSize: "0.875rem" }}>Password</label>
                <button
                  type="button"
                  onClick={() => setLoginStep("forgot-password")}
                  className="text-primary hover:underline"
                  style={{ fontSize: "0.75rem" }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-input-background"
                  style={{ fontSize: "0.875rem" }}
                  autoComplete="current-password"
                  disabled={lockedUntil !== null}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                defaultChecked
                className="rounded"
              />
              <label
                htmlFor="remember"
                className="text-muted-foreground"
                style={{ fontSize: "0.8125rem", fontWeight: 400 }}
              >
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || lockedUntil !== null}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ fontSize: "0.875rem" }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : lockedUntil ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Locked
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6">
            <button
              onClick={() => setShowDemoHint(!showDemoHint)}
              className="w-full text-center text-muted-foreground hover:text-foreground transition-colors"
              style={{ fontSize: "0.75rem" }}
            >
              {showDemoHint ? "Hide demo accounts" : "Show demo accounts ↓"}
            </button>

            {showDemoHint && (
              <div className="mt-3 space-y-4 max-h-72 overflow-y-auto pr-1">
                {demoAccountGroups.map((group) => (
                  <div key={group.category}>
                    <p
                      className="text-muted-foreground mb-1.5 px-1"
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {group.category}
                    </p>
                    <div className="space-y-1">
                      {group.accounts.map((account) => (
                        <button
                          key={account.email}
                          onClick={() => fillDemo(account)}
                          className="w-full flex items-center justify-between p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                        >
                          <div className="min-w-0">
                            <p
                              style={{ fontSize: "0.8125rem", fontWeight: 500 }}
                            >
                              {account.role}
                            </p>
                            <p
                              className="text-muted-foreground truncate"
                              style={{ fontSize: "0.6875rem" }}
                            >
                              {account.email}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            {account.twoFactorEnabled && (
                              <span
                                className="flex items-center gap-1 text-green-600 bg-green-50 px-1.5 py-0.5 rounded"
                                style={{ fontSize: "0.625rem" }}
                              >
                                <Shield className="w-2.5 h-2.5" /> 2FA
                              </span>
                            )}
                            <span
                              className="text-primary"
                              style={{ fontSize: "0.6875rem" }}
                            >
                              Use
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
