import { useState, type ElementType } from "react";
import { toast } from "sonner";
import {
  User,
  Shield,
  Bell,
  Palette,
  Lock,
  Eye,
  EyeOff,
  Download,
  Monitor,
  PanelLeft,
  CheckCircle,
  Smartphone,
  Mail,
  MessageSquare,
  Megaphone,
  CalendarCheck,
  AlertTriangle,
  BookOpen,
  Globe,
  Laptop,
  Trash2,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import { PageHeader } from "@/components/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Mock session data ─────────────────────────────────────────────────────────

const MOCK_SESSIONS = [
  { id: "s1", device: "Chrome on Windows 11", location: "London, UK", ip: "82.45.123.11", lastActive: "Active now", current: true },
  { id: "s2", device: "Safari on iPhone 15", location: "London, UK", ip: "82.45.123.11", lastActive: "2 hours ago", current: false },
  { id: "s3", device: "Firefox on macOS", location: "Birmingham, UK", ip: "91.32.45.67", lastActive: "3 days ago", current: false },
];

// ─── Notification category config ─────────────────────────────────────────────

type NotifChannel = "email" | "sms" | "inapp";

interface NotifPref {
  id: string;
  icon: ElementType;
  label: string;
  description: string;
  channels: Record<NotifChannel, boolean>;
}

const DEFAULT_NOTIF_PREFS: NotifPref[] = [
  { id: "attendance", icon: CalendarCheck, label: "Attendance Alerts", description: "Student absence and late notifications", channels: { email: true, sms: true, inapp: true } },
  { id: "grades", icon: BookOpen, label: "Grade Updates", description: "When grades are published or updated", channels: { email: true, sms: false, inapp: true } },
  { id: "announcements", icon: Megaphone, label: "Announcements", description: "School-wide and group announcements", channels: { email: false, sms: false, inapp: true } },
  { id: "messages", icon: MessageSquare, label: "Messages", description: "Direct messages from staff or parent", channels: { email: true, sms: false, inapp: true } },
  { id: "incidents", icon: AlertTriangle, label: "Incidents", description: "New incident reports and updates", channels: { email: true, sms: false, inapp: true } },
  { id: "system", icon: Monitor, label: "System Updates", description: "Maintenance and feature announcements", channels: { email: true, sms: false, inapp: false } },
];

// ─── Account Tab ───────────────────────────────────────────────────────────────

function AccountTab() {
  const { name, email, avatarInitials, updateProfile } = useAuthStore();
  const [displayName, setDisplayName] = useState(name ?? "");
  const [initials, setInitials] = useState(avatarInitials ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    updateProfile({ name: displayName, avatarInitials: initials.slice(0, 2).toUpperCase() });
    setIsSaving(false);
    toast.success("Profile updated successfully");
  };

  return (
    <div className="space-y-6">
      {/* Avatar section */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Profile Picture</h3>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white text-xl font-bold shadow-sm">
            {(initials || "U").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Avatar Initials</p>
            <p className="text-xs text-gray-400 mt-0.5">Used when no photo is uploaded. Max 2 characters.</p>
            <div className="mt-2">
              <Input
                value={initials}
                onChange={(e) => setInitials(e.target.value.slice(0, 2).toUpperCase())}
                maxLength={2}
                className="w-20 text-center font-bold uppercase"
                placeholder="AB"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Personal details */}
      <Card className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-800">Personal Information</h3>

        <div className="space-y-1.5">
          <Label htmlFor="display-name" className="text-xs font-medium text-gray-700">Display Name</Label>
          <Input
            id="display-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-gray-700">Email Address</Label>
          <Input
            id="email"
            value={email ?? ""}
            readOnly
            disabled
            className="bg-gray-50 text-gray-500"
          />
          <p className="text-xs text-gray-400">Your school email address cannot be changed here. Contact your IT administrator.</p>
        </div>

        <div className="pt-2">
          <Button onClick={handleSave} disabled={isSaving} className="gap-1.5">
            {isSaving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ─── Security Tab ──────────────────────────────────────────────────────────────

function SecurityTab() {
  const { mfaEnabled } = useAuthStore();
  const [mfaOn, setMfaOn] = useState(mfaEnabled);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handlePasswordSave = async () => {
    if (!currentPw || !newPw || newPw !== confirmPw) {
      toast.error(newPw !== confirmPw ? "New passwords do not match" : "Please fill in all fields");
      return;
    }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSaving(false);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    toast.success("Password updated successfully");
  };

  return (
    <div className="space-y-6">
      {/* MFA */}
      <Card className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Two-Factor Authentication (MFA)</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Add an extra layer of security. You'll need an authenticator app.
              </p>
              {mfaOn && (
                <Badge variant="outline" className="mt-2 text-xs text-green-700 border-green-200 bg-green-50">
                  <CheckCircle className="h-3 w-3 mr-1" /> Enabled
                </Badge>
              )}
            </div>
          </div>
          <Switch
            checked={mfaOn}
            onCheckedChange={(v) => {
              setMfaOn(v);
              toast.success(v ? "MFA enabled — configure your authenticator app" : "MFA disabled");
            }}
          />
        </div>
      </Card>

      {/* Change Password */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-800">Change Password</h3>
        </div>

        {[
          { id: "current", label: "Current Password", value: currentPw, setter: setCurrentPw, show: showCurrent, toggleShow: () => setShowCurrent(!showCurrent) },
          { id: "new", label: "New Password", value: newPw, setter: setNewPw, show: showNew, toggleShow: () => setShowNew(!showNew) },
          { id: "confirm", label: "Confirm New Password", value: confirmPw, setter: setConfirmPw, show: showConfirm, toggleShow: () => setShowConfirm(!showConfirm) },
        ].map((field) => (
          <div key={field.id} className="space-y-1.5">
            <Label htmlFor={`pw-${field.id}`} className="text-xs font-medium text-gray-700">{field.label}</Label>
            <div className="relative">
              <Input
                id={`pw-${field.id}`}
                type={field.show ? "text" : "password"}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                className="pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={field.toggleShow}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {field.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        ))}

        {newPw && confirmPw && newPw !== confirmPw && (
          <p className="text-xs text-red-500">Passwords do not match</p>
        )}

        <div className="pt-1">
          <Button onClick={handlePasswordSave} disabled={isSaving} className="gap-1.5">
            {isSaving ? "Updating…" : "Update Password"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ─── Notifications Tab ─────────────────────────────────────────────────────────

function NotificationsTab() {
  const [prefs, setPrefs] = useState<NotifPref[]>(DEFAULT_NOTIF_PREFS);
  const [isSaving, setIsSaving] = useState(false);

  const toggle = (id: string, channel: NotifChannel) => {
    setPrefs((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, channels: { ...p.channels, [channel]: !p.channels[channel] } }
          : p
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsSaving(false);
    toast.success("Notification preferences saved");
  };

  const CHANNEL_ICONS: Record<NotifChannel, ElementType> = {
    email: Mail,
    sms: Smartphone,
    inapp: Bell,
  };

  const CHANNEL_LABELS: Record<NotifChannel, string> = {
    email: "Email",
    sms: "SMS",
    inapp: "In-App",
  };

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-800">Notification Channels</h3>
          <p className="text-xs text-gray-400 mt-0.5">Choose how to receive each notification type.</p>
        </div>

        {/* Header row */}
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="flex-1" />
          {(["email", "sms", "inapp"] as NotifChannel[]).map((ch) => {
            const ChIcon = CHANNEL_ICONS[ch];
            return (
              <div key={ch} className="w-14 flex flex-col items-center gap-0.5">
                <ChIcon className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-xs text-gray-400">{CHANNEL_LABELS[ch]}</span>
              </div>
            );
          })}
        </div>

        <div className="space-y-1">
          {prefs.map((pref, i) => {
            const PrefIcon = pref.icon;
            return (
              <div key={pref.id}>
                {i > 0 && <Separator className="my-1" />}
                <div className="flex items-center gap-3 py-2 px-1">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                      <PrefIcon className="h-3.5 w-3.5 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{pref.label}</p>
                      <p className="text-xs text-gray-400 truncate">{pref.description}</p>
                    </div>
                  </div>
                  {(["email", "sms", "inapp"] as NotifChannel[]).map((ch) => (
                    <div key={ch} className="w-14 flex justify-center">
                      <Switch
                        checked={pref.channels[ch]}
                        onCheckedChange={() => toggle(pref.id, ch)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <Button onClick={handleSave} disabled={isSaving} size="sm">
            {isSaving ? "Saving…" : "Save Preferences"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ─── Appearance Tab ────────────────────────────────────────────────────────────

function AppearanceTab() {
  const { compactMode, toggleCompactMode, sidebarCollapsed, setSidebarCollapsed } = useUIStore();

  return (
    <div className="space-y-4">
      <Card className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-800">Display Preferences</h3>

        <div className="flex items-center justify-between py-3 border-b border-gray-50">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50">
              <Monitor className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Compact Mode</p>
              <p className="text-xs text-gray-400 mt-0.5">Reduces spacing for denser information layout</p>
            </div>
          </div>
          <Switch
            checked={compactMode}
            onCheckedChange={() => {
              toggleCompactMode();
              toast.success(compactMode ? "Standard mode enabled" : "Compact mode enabled");
            }}
          />
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-50">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50">
              <PanelLeft className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Collapse Sidebar by Default</p>
              <p className="text-xs text-gray-400 mt-0.5">Sidebar will be minimised when you open SETU</p>
            </div>
          </div>
          <Switch
            checked={sidebarCollapsed}
            onCheckedChange={(v) => {
              setSidebarCollapsed(v);
              toast.success(v ? "Sidebar will default to collapsed" : "Sidebar will default to expanded");
            }}
          />
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50">
              <Palette className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Theme</p>
              <p className="text-xs text-gray-400 mt-0.5">Dark mode coming soon</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">Light Mode</Badge>
        </div>
      </Card>
    </div>
  );
}

// ─── Privacy Tab ────────────────────────────────────────────────────────────────

function PrivacyTab() {
  const { name } = useAuthStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsExporting(false);
    // Mock a download
    const blob = new Blob(
      [JSON.stringify({ user: name, exportedAt: new Date().toISOString(), note: "Mock data export — no real data in demo" }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "setu-data-export.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data export downloaded");
  };

  return (
    <div className="space-y-4">
      {/* Data export */}
      <Card className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
            <Download className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Export Your Data</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Download a copy of your profile, preferences, and activity data in JSON format.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={isExporting}
          className="gap-1.5"
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Preparing export…" : "Download My Data"}
        </Button>
      </Card>

      {/* Active sessions */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">Active Sessions</h3>
        <p className="text-xs text-gray-400 mb-4">Devices where you're currently signed in to SETU.</p>

        <div className="space-y-2">
          {MOCK_SESSIONS.map((session) => (
            <div
              key={session.id}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-3.5",
                session.current ? "border-blue-100 bg-blue-50/40" : "border-gray-100"
              )}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white border border-gray-200">
                {session.device.toLowerCase().includes("iphone") || session.device.toLowerCase().includes("android") ? (
                  <Smartphone className="h-4 w-4 text-gray-500" />
                ) : session.device.toLowerCase().includes("safari") ? (
                  <Globe className="h-4 w-4 text-gray-500" />
                ) : (
                  <Laptop className="h-4 w-4 text-gray-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs font-medium text-gray-800 truncate">{session.device}</p>
                  {session.current && (
                    <Badge variant="outline" className="text-xs text-green-700 border-green-200 bg-green-50 py-0 h-4">
                      Current
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{session.location} · {session.ip}</p>
                <p className="text-xs text-gray-400">{session.lastActive}</p>
              </div>
              {!session.current && (
                <button
                  onClick={() => toast.success("Session revoked")}
                  className="shrink-0 p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  title="Revoke session"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Main SettingsPage ─────────────────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Settings"
        subtitle="Manage your account, security, and preferences"
        icon={User}
        iconColor="bg-gray-700"
      />

      <div className="flex-1 p-6">
        <Tabs defaultValue="account" className="space-y-5">
          <TabsList className="flex-wrap h-auto gap-1 bg-gray-100 p-1">
            {[
              { value: "account", label: "Account", icon: User },
              { value: "security", label: "Security", icon: Shield },
              { value: "notifications", label: "Notifications", icon: Bell },
              { value: "appearance", label: "Appearance", icon: Palette },
              { value: "privacy", label: "Privacy", icon: Lock },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <TabIcon className="h-3.5 w-3.5" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="max-w-2xl">
            <TabsContent value="account" className="mt-0">
              <AccountTab />
            </TabsContent>
            <TabsContent value="security" className="mt-0">
              <SecurityTab />
            </TabsContent>
            <TabsContent value="notifications" className="mt-0">
              <NotificationsTab />
            </TabsContent>
            <TabsContent value="appearance" className="mt-0">
              <AppearanceTab />
            </TabsContent>
            <TabsContent value="privacy" className="mt-0">
              <PrivacyTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
