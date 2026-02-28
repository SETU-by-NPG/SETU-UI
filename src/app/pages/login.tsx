import { useState } from "react";
import { useNavigate } from "react-router";
import { School, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

// SSO config mirrors the security settings
const ssoProviders = [
  { id: "google", name: "Google", enabled: true, color: "#4285F4", icon: "G" },
  { id: "microsoft", name: "Microsoft", enabled: false, color: "#00A4EF", icon: "M" },
];

const demoAccounts = [
  { email: "sarah.mitchell@setu.edu", password: "admin123", role: "IT Administrator" },
  { email: "john.w@setu.edu", password: "teacher123", role: "Teacher" },
  { email: "alice@setu.edu", password: "student123", role: "Student" },
  { email: "robert@email.com", password: "parent123", role: "Parent" },
  { email: "priya.n@setu.edu", password: "librarian123", role: "Librarian" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemoHint, setShowDemoHint] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const account = demoAccounts.find(
      (a) => a.email === email && a.password === password
    );

    if (!account) {
      setError("Invalid email or password. Use the demo credentials below.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Store auth state
      localStorage.setItem("setu_auth", JSON.stringify({ email: account.email, role: account.role }));
      navigate("/");
    }, 800);
  };

  const handleSSO = (providerId: string) => {
    const provider = ssoProviders.find((p) => p.id === providerId);
    if (!provider?.enabled) return;

    setLoading(true);
    setError("");
    setTimeout(() => {
      // SSO defaults to admin login
      localStorage.setItem("setu_auth", JSON.stringify({ email: "sarah.mitchell@setu.edu", role: "IT Administrator" }));
      navigate("/");
    }, 1000);
  };

  const fillDemo = (account: typeof demoAccounts[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  };

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
          <p className="opacity-70 mt-1" style={{ fontSize: "0.875rem" }}>Education Management System</p>
        </div>
        <div>
          <h2 style={{ fontSize: "2rem", fontWeight: 600, lineHeight: 1.3 }}>
            Manage your school<br />with clarity.
          </h2>
          <p className="mt-4 opacity-70 max-w-md" style={{ fontSize: "0.9375rem", lineHeight: 1.6 }}>
            A unified platform for administrators, teachers, students, and parents. 
            From attendance to analytics, everything in one place.
          </p>
        </div>
        <p className="opacity-40" style={{ fontSize: "0.75rem" }}>&copy; 2026 SETU Academy. All rights reserved.</p>
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
          <p className="text-muted-foreground mt-1 mb-6" style={{ fontSize: "0.875rem" }}>
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
                  style={{ backgroundColor: provider.color, fontSize: "0.75rem", fontWeight: 700 }}
                >
                  {provider.icon}
                </span>
                <span>Continue with {provider.name}</span>
                {!provider.enabled && (
                  <span className="ml-auto text-muted-foreground" style={{ fontSize: "0.6875rem" }}>Not configured</span>
                )}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>OR</span>
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
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label style={{ fontSize: "0.875rem" }}>Password</label>
                <button type="button" className="text-primary hover:underline" style={{ fontSize: "0.75rem" }}>
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" defaultChecked className="rounded" />
              <label htmlFor="remember" className="text-muted-foreground" style={{ fontSize: "0.8125rem", fontWeight: 400 }}>
                Remember me for 30 days
              </label>
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
                  Signing in...
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
              {showDemoHint ? "Hide demo accounts" : "Show demo accounts"}
            </button>

            {showDemoHint && (
              <div className="mt-3 space-y-1.5">
                {demoAccounts.map((account) => (
                  <button
                    key={account.email}
                    onClick={() => fillDemo(account)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                  >
                    <div>
                      <p style={{ fontSize: "0.8125rem", fontWeight: 500 }}>{account.role}</p>
                      <p className="text-muted-foreground" style={{ fontSize: "0.6875rem" }}>{account.email}</p>
                    </div>
                    <span className="text-primary" style={{ fontSize: "0.6875rem" }}>Use</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}