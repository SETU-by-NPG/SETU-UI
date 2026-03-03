import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { useAppSettings, CURRENCIES } from "../context/app-settings-context";
import { type Role } from "../types";
import { School, Upload, Check, Loader2, Building2, Calendar, Globe, DollarSign, Phone, Mail, MapPin, ArrowRight, Sparkles } from "lucide-react";

const TIMEZONES = [
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "Europe/London", label: "GMT/BST" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST)" },
  { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
  { value: "Asia/Singapore", label: "Singapore Time (SGT)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
];

interface SchoolFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  email: string;
  phone: string;
  logo: string | null;
  academicYearStart: string;
  timezone: string;
  currency: string;
}

export default function SetupPage() {
  const navigate = useNavigate();
  const { role } = useOutletContext<{ role: Role }>();

  // Role-based access control: only admins can access setup
  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    }
  }, [role, navigate]);

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  const [formData, setFormData] = useState<SchoolFormData>({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    email: "",
    phone: "",
    logo: null,
    academicYearStart: new Date().toISOString().split('T')[0],
    timezone: "America/New_York",
    currency: "USD",
  });

  const handleInputChange = (field: keyof SchoolFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = () => {
    // Mock logo upload - in production this would open a file picker
    setFormData(prev => ({
      ...prev,
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(prev.name || "School")
    }));
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, logo: null }));
  };

  const handleSubmit = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
    }, 1500);
  };

  const handleSkip = () => {
    if (showSkipConfirm) {
      navigate("/dashboard");
    } else {
      setShowSkipConfirm(true);
    }
  };

  const handleContinueToDashboard = () => {
    navigate("/dashboard");
  };

  // Success state
  if (saved) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
        <div className="w-full max-w-md mx-auto px-6 py-12 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-in zoom-in-50 duration-500">
              <Check className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-semibold text-foreground mb-3">
              Setup Complete!
            </h1>
            <p className="text-muted-foreground text-lg">
              Your school has been configured successfully.
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 mb-8 text-left">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">School Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-primary" />
                <span className="font-medium">{formData.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">{formData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {TIMEZONES.find(tz => tz.value === formData.timezone)?.label}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleContinueToDashboard}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full py-6 px-6 lg:px-12 border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <School className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">SETU</h1>
                <p className="text-xs text-muted-foreground">Education Management Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>Welcome to your new school setup</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-4xl mx-auto">
            {/* Page Title */}
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-semibold mb-3">
                School Setup
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Let's get your school configured in just a few simple steps. This information will be used throughout the platform.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-8 lg:p-12">
              {/* Logo Upload Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 pb-10 border-b border-border">
                <div 
                  className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={handleLogoUpload}
                >
                  {formData.logo ? (
                    <img src={formData.logo} alt="School Logo" className="w-full h-full object-cover" />
                  ) : (
                    <School className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-medium mb-1">School Logo</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload your school logo or emblem. Recommended: 200x200px, PNG or JPG.
                  </p>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <button
                      onClick={handleLogoUpload}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Logo
                    </button>
                    {formData.logo && (
                      <button
                        onClick={handleRemoveLogo}
                        className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-8">
                {/* School Information */}
                <section>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    School Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        School Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="e.g., Springdale Academy"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        School Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="Street address"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="City"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">State/Province</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        placeholder="State"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Country</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        placeholder="Country"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Zip/Postal Code</label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        placeholder="Zip code"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </section>

                {/* Contact Information */}
                <section>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Contact Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="admin@school.edu"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Contact Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Academic Settings */}
                <section>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Academic Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Academic Year Start <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="date"
                          value={formData.academicYearStart}
                          onChange={(e) => handleInputChange("academicYearStart", e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Timezone <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <select
                          value={formData.timezone}
                          onChange={(e) => handleInputChange("timezone", e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                        >
                          {TIMEZONES.map(tz => (
                            <option key={tz.value} value={tz.value}>{tz.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Currency <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <select
                          value={formData.currency}
                          onChange={(e) => handleInputChange("currency", e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                        >
                          {CURRENCIES.map(c => (
                            <option key={c.code} value={c.code}>{c.name} ({c.symbol})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Action Buttons */}
              <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={handleSkip}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showSkipConfirm ? "Click again to skip setup" : "I'll do this later"}
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading || !formData.name || !formData.email || !formData.phone}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving Configuration...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <Check className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground mt-8">
              You can always update these settings later from the Settings page.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
