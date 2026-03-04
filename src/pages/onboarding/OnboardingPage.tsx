import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  CheckCircle,
  Upload,
  UserCircle,
  Building2,
  ChevronRight,
  ChevronLeft,
  Image,
  Bell,
  Mail,
  MessageSquare,
  BookOpen,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

// ─── Role descriptions ─────────────────────────────────────────────────────────

const ROLE_DESCRIPTIONS: Partial<
  Record<Role, { title: string; description: string }>
> = {
  MASTER_ADMIN: {
    title: "System Administrator",
    description:
      "You have full access to all SETU modules including user management, system configuration, audit logs, and school-wide reporting.",
  },
  IT_ADMINISTRATOR: {
    title: "IT Administrator",
    description:
      "You manage system settings, user accounts, integrations, and IT infrastructure across the school.",
  },
  HEAD_OF_SCHOOL: {
    title: "Head of School",
    description:
      "You have executive access to all school data, staff performance, student outcomes, and strategic reporting.",
  },
  SLT_MEMBER: {
    title: "Senior Leadership",
    description:
      "You can access school-wide data, moderation tools, and strategic dashboards to support school improvement.",
  },
  TEACHER: {
    title: "Teacher",
    description:
      "You can manage your classes, register attendance, set and mark assignments, record grades, and communicate with students and parents.",
  },
  HEAD_OF_YEAR: {
    title: "Head of Year",
    description:
      "You oversee your year group's pastoral care, attendance, incidents, and communications with students and families.",
  },
  HEAD_OF_DEPARTMENT: {
    title: "Head of Department",
    description:
      "You manage your department's curriculum, staff, assessments, and performance reporting.",
  },
  ATTENDANCE_WELFARE_OFFICER: {
    title: "Attendance & Welfare Officer",
    description:
      "You monitor and manage student attendance patterns, follow up on absences, and support student wellbeing.",
  },
  STUDENT: {
    title: "Student",
    description:
      "You can view your timetable, attendance record, grades, assignments, and communicate with your teachers.",
  },
  PARENT: {
    title: "Parent / Guardian",
    description:
      "You can monitor your child's attendance, grades, assignments, and communicate with the school.",
  },
  SAFEGUARDING_LEAD: {
    title: "Safeguarding Lead",
    description:
      "You manage all safeguarding concerns, case records, and ensure compliance with statutory requirements.",
  },
  HR_MANAGER: {
    title: "HR Manager",
    description:
      "You manage staff records, contracts, leave, performance, and recruitment across the school.",
  },
  FINANCE_MANAGER: {
    title: "Finance Manager",
    description:
      "You oversee the school budget, invoices, expenditure, and financial reporting.",
  },
};

const DEFAULT_ROLE_INFO = {
  title: "Staff Member",
  description:
    "Welcome to SETU. You have access to the modules relevant to your role. Explore using the sidebar navigation.",
};

// ─── Notification preference options ──────────────────────────────────────────

const NOTIFICATION_PREFS = [
  {
    id: "email",
    icon: Mail,
    label: "Email Notifications",
    description: "Receive updates and alerts via email",
  },
  {
    id: "sms",
    icon: MessageSquare,
    label: "SMS Alerts",
    description: "Get urgent notifications by text message",
  },
  {
    id: "digest",
    icon: BookOpen,
    label: "Weekly Digest",
    description: "A summary of activity sent every Monday",
  },
  {
    id: "inapp",
    icon: Bell,
    label: "In-App Notifications",
    description: "Bell icon alerts inside SETU",
  },
];

// ─── Step indicators ───────────────────────────────────────────────────────────

const STEPS = [
  { label: "Welcome" },
  { label: "Profile Photo" },
  { label: "Notifications" },
];

// ─── Avatar dropzone ────────────────────────────────────────────────────────────

function AvatarDropzone({
  initials,
  preview,
  onDrop,
}: {
  initials: string;
  preview: string | null;
  onDrop: (file: File) => void;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (files) => {
      if (files[0]) onDrop(files[0]);
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-8 transition-all cursor-pointer",
        isDragActive
          ? "border-blue-400 bg-blue-50/50"
          : "border-white/20 hover:border-white/40 hover:bg-white/5",
      )}
    >
      <input {...getInputProps()} />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Avatar preview"
            className="h-24 w-24 rounded-full object-cover border-4 border-white/20"
          />
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
            <Image className="h-6 w-6 text-white" />
          </div>
        </div>
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 border-4 border-primary/30 text-2xl font-bold text-white">
          {initials}
        </div>
      )}

      <div className="text-center">
        <p className="text-sm font-medium text-white/80">
          {isDragActive
            ? "Drop your photo here"
            : "Drag & drop or click to upload"}
        </p>
        <p className="text-xs text-white/40 mt-0.5">PNG, JPG, WEBP up to 5MB</p>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white/70">
        <Upload className="h-3.5 w-3.5" />
        Choose photo
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { name, role, avatarInitials, setOnboardingComplete } = useAuthStore();

  const [step, setStep] = useState(0);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>({
    email: true,
    sms: false,
    digest: true,
    inapp: true,
  });
  const [isFinishing, setIsFinishing] = useState(false);

  const currentRole = role ?? "SUPPORT_STAFF";
  const roleInfo = ROLE_DESCRIPTIONS[currentRole] ?? DEFAULT_ROLE_INFO;
  const initials =
    avatarInitials ??
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("") ??
    "U";
  const firstName = name?.split(" ")[0] ?? "there";

  const handleDrop = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  }, []);

  const handleFinish = async () => {
    setIsFinishing(true);
    await new Promise((r) => setTimeout(r, 800));
    setOnboardingComplete();
    navigate("/dashboard");
  };

  const progressWidth = `${((step + 1) / STEPS.length) * 100}%`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#1A1D23] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white font-bold text-xl mb-3 shadow-lg shadow-primary/30">
            S
          </div>
          <h1 className="text-xl font-bold text-white">
            SETU Education Management
          </h1>
          <p className="text-blue-200/60 text-sm mt-0.5">Hartfield Academy</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-white/10">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: progressWidth }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between px-6 pt-4 pb-2">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-all",
                    i < step
                      ? "bg-green-500 text-white"
                      : i === step
                        ? "bg-primary text-white"
                        : "bg-white/10 text-white/40",
                  )}
                >
                  {i < step ? <CheckCircle className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    i === step ? "text-white" : "text-white/40",
                  )}
                >
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <div className="ml-1 h-px w-8 bg-white/20" />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="px-6 py-5">
            {/* Step 0: Welcome */}
            {step === 0 && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 border border-primary/30 text-2xl font-bold text-white mb-3">
                    {initials}
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Welcome, {firstName}!
                  </h2>
                  <p className="text-blue-200/60 text-sm mt-1">
                    Let's get you set up with SETU
                  </p>
                </div>

                <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 border border-primary/30">
                      <UserCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white uppercase tracking-wide">
                        Your Role
                      </p>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {roleInfo.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 border border-blue-500/30">
                      <Building2 className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white uppercase tracking-wide">
                        School
                      </p>
                      <p className="text-sm font-bold text-white mt-0.5">
                        Hartfield Academy
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-blue-200/70 leading-relaxed">
                  {roleInfo.description}
                </p>

                <div className="rounded-xl bg-blue-500/10 border border-blue-400/20 p-3 space-y-1.5">
                  <p className="text-xs font-semibold text-blue-200 uppercase tracking-wide">
                    What SETU does
                  </p>
                  {[
                    "Centralises all school data in one secure place",
                    "Streamlines attendance, grades, and communication",
                    "Gives role-specific tools to every staff member",
                  ].map((point) => (
                    <div key={point} className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-green-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-200/70">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Profile photo */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white">
                    Add a profile photo
                  </h2>
                  <p className="text-blue-200/60 text-sm mt-1">
                    Help your colleagues recognise you. You can skip this step.
                  </p>
                </div>

                <AvatarDropzone
                  initials={initials}
                  preview={avatarPreview}
                  onDrop={handleDrop}
                />

                {avatarPreview && (
                  <button
                    onClick={() => setAvatarPreview(null)}
                    className="w-full text-xs text-white/40 hover:text-white/60 transition-colors text-center"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            )}

            {/* Step 2: Notification preferences */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white">
                    Notification preferences
                  </h2>
                  <p className="text-blue-200/60 text-sm mt-1">
                    Choose how you want SETU to keep you informed.
                  </p>
                </div>

                <div className="space-y-2">
                  {NOTIFICATION_PREFS.map((pref) => {
                    const PrefIcon = pref.icon;
                    return (
                      <div
                        key={pref.id}
                        className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3.5"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                          <PrefIcon className="h-4 w-4 text-white/70" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">
                            {pref.label}
                          </p>
                          <p className="text-xs text-white/40 truncate">
                            {pref.description}
                          </p>
                        </div>
                        <Switch
                          checked={notifPrefs[pref.id] ?? false}
                          onCheckedChange={(checked) =>
                            setNotifPrefs((p) => ({ ...p, [pref.id]: checked }))
                          }
                        />
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-white/30 text-center">
                  You can change these at any time in Settings.
                </p>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between px-6 pb-6 gap-3">
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
              className={cn(
                "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white gap-1.5",
                step === 0 && "invisible",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex items-center gap-1">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === step
                      ? "w-5 bg-primary"
                      : i < step
                        ? "w-2.5 bg-green-500"
                        : "w-2.5 bg-white/20",
                  )}
                />
              ))}
            </div>

            {step < STEPS.length - 1 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                className="bg-primary hover:bg-primary-hover text-white gap-1.5 shadow-lg shadow-primary/30"
              >
                {step === 1 ? (avatarPreview ? "Continue" : "Skip") : "Next"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={isFinishing}
                className="bg-green-600 hover:bg-green-700 text-white gap-1.5 shadow-lg shadow-green-600/30"
              >
                {isFinishing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Finish Setup
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-white/20 mt-4">
          SETU Education Management System &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
