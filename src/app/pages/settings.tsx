import { useState } from "react";
import { useOutletContext } from "react-router";
import {
  Save, Check, School, Shield, Plug, Database, Bell, Globe,
  Key, HardDrive, RefreshCw, Download, Trash2, ToggleLeft, ToggleRight,
  ChevronRight, AlertCircle, CheckCircle, XCircle, Search,
  Server, Cpu, Activity, ExternalLink, Settings, Users, Lock, Zap
} from "lucide-react";
import { StatusBadge } from "../components/status-badge";
import { integrations, recentBackups, subscription, serviceStatuses, type Role } from "../data/mock-data";

const adminTabs = [
  { id: "overview", label: "Overview", icon: <Server className="w-4 h-4" /> },
  { id: "school", label: "Organization", icon: <School className="w-4 h-4" /> },
  { id: "academic", label: "Academic Config", icon: <Cpu className="w-4 h-4" /> },
  { id: "modules", label: "Modules", icon: <Activity className="w-4 h-4" /> },
  { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
  { id: "integrations", label: "Integrations", icon: <Plug className="w-4 h-4" /> },
  { id: "backups", label: "Data & Backups", icon: <Database className="w-4 h-4" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
];

const basicTabs = [
  { id: "school", label: "School Profile", icon: <School className="w-4 h-4" /> },
  { id: "academic", label: "Academic Year", icon: <Cpu className="w-4 h-4" /> },
  { id: "classes", label: "Classes & Sections", icon: <Users className="w-4 h-4" /> },
  { id: "subjects", label: "Subjects", icon: <Activity className="w-4 h-4" /> },
];

const modules = [
  { id: "m1", name: "Student Management", description: "Student profiles, enrollment, records", enabled: true, core: true },
  { id: "m2", name: "Teacher Management", description: "Teacher profiles and class assignments", enabled: true, core: true },
  { id: "m3", name: "Attendance", description: "Daily attendance marking and tracking", enabled: true, core: true },
  { id: "m4", name: "Assignments", description: "Assignment creation, submission, grading", enabled: true, core: false },
  { id: "m5", name: "Gradebook", description: "Grade management and report cards", enabled: true, core: false },
  { id: "m6", name: "Timetable", description: "Class scheduling and room management", enabled: true, core: false },
  { id: "m7", name: "Reports & Analytics", description: "Academic reports and data analytics", enabled: true, core: false },
  { id: "m8", name: "Announcements", description: "School-wide notifications and notices", enabled: true, core: false },
  { id: "m9", name: "Messaging", description: "In-app messaging between users", enabled: true, core: false },
  { id: "m10", name: "Library Management", description: "Book catalog, issuing, and returns", enabled: false, core: false },
];

export default function SettingsPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState(role === "admin" ? "overview" : "school");
  const [moduleStates, setModuleStates] = useState(
    modules.reduce((acc, m) => ({ ...acc, [m.id]: m.enabled }), {} as Record<string, boolean>)
  );

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleModule = (id: string) => {
    setModuleStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const tabs = role === "admin" ? adminTabs : basicTabs;

  const integrationStatusIcon = (status: string) => {
    switch (status) {
      case "connected": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error": return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <XCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (role === "admin") {
    return (
      <div className="flex h-[calc(100vh-8rem)] -m-4 lg:-m-6">
        {/* Left sidebar navigation — Azure style */}
        <div className="w-56 bg-card border-r border-border shrink-0 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600 }}>System Settings</h2>
            <p className="text-muted-foreground mt-0.5" style={{ fontSize: "0.6875rem" }}>{subscription.orgName}</p>
          </div>
          <nav className="flex-1 overflow-y-auto p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors mb-0.5 ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                style={{ fontSize: "0.8125rem" }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-border">
            <button
              onClick={handleSave}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
                saved ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
              style={{ fontSize: "0.8125rem" }}
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? "Saved" : "Save All"}
            </button>
          </div>
        </div>

        {/* Right content area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* Overview */}
          {activeTab === "overview" && (
            <div>
              <div className="mb-6">
                <h1 style={{ fontSize: "1.25rem" }}>Platform Overview</h1>
                <p className="text-muted-foreground mt-1" style={{ fontSize: "0.875rem" }}>Your SETU instance at a glance.</p>
              </div>

              {/* Subscription Card */}
              <div className="bg-card border border-border rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3>Subscription</h3>
                  <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200" style={{ fontSize: "0.65rem", fontWeight: 500 }}>ACTIVE</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Plan", value: subscription.planName },
                    { label: "Region", value: subscription.region },
                    { label: "Billing", value: `${subscription.billingCycle} — renews ${subscription.nextBillingDate}` },
                    { label: "Support", value: subscription.supportTier },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{item.label}</p>
                      <p style={{ fontSize: "0.875rem", fontWeight: 500 }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resource Limits */}
              <div className="bg-card border border-border rounded-xl p-6 mb-6">
                <h3 className="mb-4">Resource Limits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { label: "Max Users", value: subscription.maxUsers.toLocaleString() },
                    { label: "Storage", value: subscription.maxStorage },
                    { label: "Daily API Calls", value: subscription.maxApiCalls.toLocaleString() },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-4 rounded-lg bg-muted/50">
                      <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>{item.value}</p>
                      <p className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Health */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3>Service Health</h3>
                  <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Provided by SETU Platform</span>
                </div>
                <div className="space-y-2">
                  {serviceStatuses.map((svc) => (
                    <div key={svc.name} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${svc.status === "operational" ? "bg-green-500" : svc.status === "degraded" ? "bg-amber-500" : svc.status === "maintenance" ? "bg-blue-500" : "bg-red-500"}`} />
                        <span style={{ fontSize: "0.875rem" }}>{svc.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        {svc.latency !== "—" && <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{svc.latency}</span>}
                        <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{svc.uptime} uptime</span>
                        <StatusBadge status={svc.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Organization Profile */}
          {activeTab === "school" && (
            <div>
              <div className="mb-6">
                <h1 style={{ fontSize: "1.25rem" }}>{role === "admin" ? "Organization Profile" : "School Profile"}</h1>
                <p className="text-muted-foreground mt-1" style={{ fontSize: "0.875rem" }}>Basic information about your institution.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h3>General</h3>
                  <div>
                    <label style={{ fontSize: "0.875rem" }}>School Name</label>
                    <input type="text" defaultValue="SETU Academy" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label style={{ fontSize: "0.875rem" }}>Email</label><input type="email" defaultValue="admin@setu.edu" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
                    <div><label style={{ fontSize: "0.875rem" }}>Phone</label><input type="tel" defaultValue="+91 98765 43210" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
                  </div>
                  <div><label style={{ fontSize: "0.875rem" }}>Address</label><input type="text" defaultValue="123 Education Lane, Bangalore, India" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h3>Preferences</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label style={{ fontSize: "0.875rem" }}>Timezone</label>
                      <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
                        <option>Asia/Kolkata (IST)</option><option>America/New_York (EST)</option><option>Europe/London (GMT+0)</option>
                      </select>
                    </div>
                    <div><label style={{ fontSize: "0.875rem" }}>Currency</label>
                      <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
                        <option>INR</option><option>USD ($)</option><option>EUR</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.875rem" }}>School Logo</label>
                    <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>Drop logo here or click to upload</p>
                      <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                  {role === "admin" && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                        Tenant ID: <span className="font-mono">{subscription.tenantId}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Academic Config */}
          {activeTab === "academic" && (
            <div>
              <div className="mb-6">
                <h1 style={{ fontSize: "1.25rem" }}>Academic Configuration</h1>
                <p className="text-muted-foreground mt-1" style={{ fontSize: "0.875rem" }}>Academic year, terms, and scheduling.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h3>Academic Year</h3>
                  <div><label style={{ fontSize: "0.875rem" }}>Year</label><input type="text" defaultValue="2025-2026" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label style={{ fontSize: "0.875rem" }}>Start</label><input type="date" defaultValue="2025-09-01" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
                    <div><label style={{ fontSize: "0.875rem" }}>End</label><input type="date" defaultValue="2026-07-15" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h3>Terms</h3>
                  {["Autumn Term (Sep - Dec)", "Spring Term (Jan - Mar)", "Summer Term (Apr - Jul)"].map((term) => (
                    <div key={term} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <span style={{ fontSize: "0.875rem" }}>{term}</span>
                      <button className="text-muted-foreground hover:text-foreground" style={{ fontSize: "0.8125rem" }}>Edit</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Classes & Sections (non-admin) */}
          {activeTab === "classes" && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="space-y-2">
                {["Grade 10 — Sections: A, B", "Grade 11 — Sections: A, B", "Grade 12 — Sections: A"].map((cls) => (
                  <div key={cls} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span style={{ fontSize: "0.875rem" }}>{cls}</span>
                    <button className="text-muted-foreground hover:text-foreground" style={{ fontSize: "0.8125rem" }}>Edit</button>
                  </div>
                ))}
              </div>
              <button className="mt-4 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors" style={{ fontSize: "0.875rem" }}>+ Add Grade Level</button>
            </div>
          )}

          {/* Subjects (non-admin) */}
          {activeTab === "subjects" && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="space-y-2">
                {["Mathematics — Algebra, Calculus", "Science — Physics, Chemistry", "English — Literature, Grammar", "Social Studies — History, Geography", "Computer Science — Programming, Data Structures"].map((sub) => (
                  <div key={sub} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span style={{ fontSize: "0.875rem" }}>{sub}</span>
                    <button className="text-muted-foreground hover:text-foreground" style={{ fontSize: "0.8125rem" }}>Edit</button>
                  </div>
                ))}
              </div>
              <button className="mt-4 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors" style={{ fontSize: "0.875rem" }}>+ Add Subject</button>
            </div>
          )}

          {/* Modules */}
          {activeTab === "modules" && (
            <div>
              <div className="mb-6">
                <h1 style={{ fontSize: "1.25rem" }}>Platform Modules</h1>
                <p className="text-muted-foreground mt-1" style={{ fontSize: "0.875rem" }}>Enable or disable modules for your organization. Core modules cannot be disabled.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {modules.map((mod) => (
                  <div key={mod.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${moduleStates[mod.id] ? "bg-primary/10" : "bg-muted"}`}>
                        <Globe className={`w-5 h-5 ${moduleStates[mod.id] ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{mod.name}</p>
                          {mod.core && <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground" style={{ fontSize: "0.6rem", fontWeight: 500 }}>CORE</span>}
                        </div>
                        <p className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>{mod.description}</p>
                      </div>
                    </div>
                    <button onClick={() => !mod.core && toggleModule(mod.id)} disabled={mod.core} className={`${mod.core ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                      {moduleStates[mod.id] ? <ToggleRight className="w-8 h-8 text-primary" /> : <ToggleLeft className="w-8 h-8 text-muted-foreground" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div>
              <div className="mb-6">
                <h1 style={{ fontSize: "1.25rem" }}>Security & Access</h1>
                <p className="text-muted-foreground mt-1" style={{ fontSize: "0.875rem" }}>Password policies, session management, and access control.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3"><Key className="w-5 h-5 text-muted-foreground" /><h3>Password Policy</h3></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label style={{ fontSize: "0.875rem" }}>Min Length</label>
                      <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
                        <option>8 characters</option><option>10 characters</option><option>12 characters</option><option>16 characters</option>
                      </select>
                    </div>
                    <div><label style={{ fontSize: "0.875rem" }}>Expiry</label>
                      <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
                        <option>30 days</option><option>60 days</option><option>90 days</option><option>Never</option>
                      </select>
                    </div>
                  </div>
                  {[
                    { label: "Require uppercase letter", checked: true },
                    { label: "Require number", checked: true },
                    { label: "Require special character", checked: true },
                    { label: "Prevent password reuse (last 5)", checked: true },
                  ].map(item => (
                    <label key={item.label} className="flex items-center gap-3 p-2"><input type="checkbox" defaultChecked={item.checked} className="rounded" /><span style={{ fontSize: "0.875rem" }}>{item.label}</span></label>
                  ))}
                </div>

                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3"><Shield className="w-5 h-5 text-muted-foreground" /><h3>Session & Auth</h3></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label style={{ fontSize: "0.875rem" }}>Session Timeout</label>
                      <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
                        <option>15 minutes</option><option>30 minutes</option><option>1 hour</option><option>4 hours</option>
                      </select>
                    </div>
                    <div><label style={{ fontSize: "0.875rem" }}>Max Login Attempts</label>
                      <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
                        <option>3 attempts</option><option>5 attempts</option><option>10 attempts</option>
                      </select>
                    </div>
                  </div>
                  {[
                    { label: "Require 2FA for administrators", checked: true },
                    { label: "Require 2FA for all staff", checked: false },
                    { label: "Allow Google SSO login", checked: true },
                    { label: "Allow Microsoft SSO login", checked: false },
                    { label: "Auto-lock after failed attempts", checked: true },
                  ].map(item => (
                    <label key={item.label} className="flex items-center gap-3 p-2"><input type="checkbox" defaultChecked={item.checked} className="rounded" /><span style={{ fontSize: "0.875rem" }}>{item.label}</span></label>
                  ))}
                </div>

                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3"><Lock className="w-5 h-5 text-muted-foreground" /><h3>IP Blocklist</h3></div>
                  <p className="text-muted-foreground mb-3" style={{ fontSize: "0.8125rem" }}>Auto-blocked IPs from brute force detection.</p>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <span className="font-mono" style={{ fontSize: "0.875rem" }}>203.45.67.89</span>
                      <span className="text-muted-foreground ml-3" style={{ fontSize: "0.75rem" }}>Auto-blocked &middot; Feb 26, 2026</span>
                    </div>
                    <button className="text-red-500 hover:text-red-600" style={{ fontSize: "0.8125rem" }}>Unblock</button>
                  </div>
                  <button className="mt-3 px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors" style={{ fontSize: "0.8125rem" }}>+ Add IP to blocklist</button>
                </div>
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeTab === "integrations" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 style={{ fontSize: "1.25rem" }}>Integrations</h1>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: "0.875rem" }}>Third-party services, API keys, and sync settings.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted" style={{ fontSize: "0.875rem" }}><Plug className="w-4 h-4" /> Add</button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {integrations.map((integ) => (
                  <div key={integ.id} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"><Plug className="w-5 h-5 text-muted-foreground" /></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{integ.name}</p>
                          {integrationStatusIcon(integ.status)}
                        </div>
                        <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{integ.category}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-3" style={{ fontSize: "0.8125rem" }}>{integ.description}</p>
                    <div className="flex items-center justify-between">
                      {integ.lastSync !== "—" && <span className="text-muted-foreground" style={{ fontSize: "0.7rem" }}>Last sync: {integ.lastSync}</span>}
                      {integ.lastSync === "—" && <span />}
                      <div className="flex items-center gap-2">
                        {integ.status === "connected" && <button className="px-2.5 py-1 rounded-lg border border-border hover:bg-muted" style={{ fontSize: "0.75rem" }}><RefreshCw className="w-3 h-3 inline mr-1" />Sync</button>}
                        <button className={`px-2.5 py-1 rounded-lg ${integ.status === "connected" ? "border border-red-200 text-red-600 hover:bg-red-50" : "bg-primary text-primary-foreground hover:opacity-90"}`} style={{ fontSize: "0.75rem" }}>
                          {integ.status === "connected" ? "Disconnect" : integ.status === "error" ? "Reconnect" : "Connect"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data & Backups */}
          {activeTab === "backups" && (
            <div>
              <div className="mb-6">
                <h1 style={{ fontSize: "1.25rem" }}>Data & Backups</h1>
                <p className="text-muted-foreground mt-1" style={{ fontSize: "0.875rem" }}>Backup settings, data export, and management.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4"><Database className="w-5 h-5 text-muted-foreground" /><h3>Automated Backups</h3></div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label style={{ fontSize: "0.875rem" }}>Frequency</label>
                      <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
                        <option>Daily at 3:00 AM</option><option>Every 12 hours</option><option>Weekly (Sunday)</option>
                      </select>
                    </div>
                    <div><label style={{ fontSize: "0.875rem" }}>Retention</label>
                      <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }}>
                        <option>7 days</option><option>30 days</option><option>90 days</option>
                      </select>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90" style={{ fontSize: "0.875rem" }}><Database className="w-4 h-4" /> Manual Backup</button>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="mb-4">Data Export</h3>
                  <p className="text-muted-foreground mb-4" style={{ fontSize: "0.8125rem" }}>Export for compliance, migration, or reporting.</p>
                  <div className="space-y-2">
                    {[{ label: "All Users", format: "CSV" }, { label: "Academic Records", format: "Excel" }, { label: "Attendance Data", format: "CSV" }].map(exp => (
                      <button key={exp.label} className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors text-left">
                        <Download className="w-4 h-4 text-muted-foreground" />
                        <div><p style={{ fontSize: "0.875rem", fontWeight: 500 }}>{exp.label}</p><p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{exp.format}</p></div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 mb-6">
                <h3 className="mb-4">Recent Backups</h3>
                <div className="space-y-2">
                  {recentBackups.map(backup => (
                    <div key={backup.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${backup.status === "completed" ? "bg-green-500" : "bg-red-500"}`} />
                        <div><p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{backup.date}</p><p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{backup.size} &middot; {backup.type}</p></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={backup.status} />
                        {backup.status === "completed" && <button className="p-1.5 rounded-md hover:bg-muted" title="Download"><Download className="w-4 h-4 text-muted-foreground" /></button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-red-200 rounded-xl p-6">
                <h3 className="text-red-600 mb-2">Danger Zone</h3>
                <p className="text-muted-foreground mb-4" style={{ fontSize: "0.8125rem" }}>Destructive actions that cannot be undone.</p>
                <div className="space-y-3">
                  {[
                    { title: "Purge Audit Logs", desc: "Delete all logs older than 90 days" },
                    { title: "Reset Platform Data", desc: "Clear all academic data (users preserved)" },
                  ].map(item => (
                    <div key={item.title} className="flex items-center justify-between p-3 rounded-lg border border-red-200">
                      <div><p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{item.title}</p><p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{item.desc}</p></div>
                      <button className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50" style={{ fontSize: "0.8125rem" }}>{item.title.split(" ")[0]}</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div>
              <div className="mb-6">
                <h1 style={{ fontSize: "1.25rem" }}>Notification Settings</h1>
                <p className="text-muted-foreground mt-1" style={{ fontSize: "0.875rem" }}>Configure email and SMS notification preferences.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4"><Bell className="w-5 h-5 text-muted-foreground" /><h3>Email Notifications</h3></div>
                  <div className="space-y-1">
                    {[
                      { label: "New user registration", description: "When a new user is created or accepts an invite", checked: true },
                      { label: "Failed login alerts", description: "When multiple failed login attempts are detected", checked: true },
                      { label: "System backup status", description: "Daily backup success/failure notifications", checked: true },
                      { label: "Storage threshold alerts", description: "When storage usage exceeds 80%", checked: true },
                      { label: "SSL certificate expiry", description: "30 days before SSL certificate expires", checked: true },
                      { label: "Integration errors", description: "When a connected integration encounters an error", checked: true },
                      { label: "Weekly usage report", description: "Summary of platform activity and metrics", checked: false },
                    ].map(item => (
                      <label key={item.label} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <input type="checkbox" defaultChecked={item.checked} className="rounded mt-0.5" />
                        <div><p style={{ fontSize: "0.875rem", fontWeight: 500 }}>{item.label}</p><p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{item.description}</p></div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4"><Bell className="w-5 h-5 text-muted-foreground" /><h3>Notification Channels</h3></div>
                  <div className="space-y-4">
                    <div><label style={{ fontSize: "0.875rem" }}>Admin Notification Email</label><input type="email" defaultValue="admin@setu.edu" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
                    <div><label style={{ fontSize: "0.875rem" }}>SMS Alert Number</label><input type="tel" defaultValue="+91 98765 43210" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
                    <div><label style={{ fontSize: "0.875rem" }}>Webhook URL (optional)</label><input type="url" placeholder="https://hooks.slack.com/..." className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Non-admin settings (teacher/student/parent/librarian)
  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1>Settings</h1>
          <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>Configure school profile and academic settings.</p>
        </div>
        <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${saved ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:opacity-90"}`} style={{ fontSize: "0.875rem" }}>
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved" : "Save Changes"}
        </button>
      </div>

      <div className="flex gap-1 mb-6 p-1 bg-muted rounded-lg w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${activeTab === tab.id ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"}`} style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "school" && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-5 max-w-2xl">
          <div><label style={{ fontSize: "0.875rem" }}>School Name</label><input type="text" defaultValue="SETU Academy" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label style={{ fontSize: "0.875rem" }}>Email</label><input type="email" defaultValue="admin@setu.edu" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
            <div><label style={{ fontSize: "0.875rem" }}>Phone</label><input type="tel" defaultValue="+91 98765 43210" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
          </div>
          <div><label style={{ fontSize: "0.875rem" }}>Address</label><input type="text" defaultValue="123 Education Lane, Bangalore, India" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
        </div>
      )}
      {activeTab === "academic" && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-5 max-w-2xl">
          <div><label style={{ fontSize: "0.875rem" }}>Academic Year</label><input type="text" defaultValue="2025-2026" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label style={{ fontSize: "0.875rem" }}>Start Date</label><input type="date" defaultValue="2025-09-01" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
            <div><label style={{ fontSize: "0.875rem" }}>End Date</label><input type="date" defaultValue="2026-07-15" className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input-background" style={{ fontSize: "0.875rem" }} /></div>
          </div>
          <div><label style={{ fontSize: "0.875rem" }}>Terms</label>
            <div className="space-y-2 mt-2">
              {["Autumn Term (Sep - Dec)", "Spring Term (Jan - Mar)", "Summer Term (Apr - Jul)"].map(term => (
                <div key={term} className="flex items-center gap-3 p-3 rounded-lg border border-border"><span style={{ fontSize: "0.875rem" }}>{term}</span></div>
              ))}
            </div>
          </div>
        </div>
      )}
      {activeTab === "classes" && (
        <div className="bg-card border border-border rounded-xl p-6 max-w-2xl">
          <div className="space-y-2">
            {["Grade 10 — Sections: A, B", "Grade 11 — Sections: A, B", "Grade 12 — Sections: A"].map(cls => (
              <div key={cls} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <span style={{ fontSize: "0.875rem" }}>{cls}</span><button className="text-muted-foreground hover:text-foreground" style={{ fontSize: "0.8125rem" }}>Edit</button>
              </div>
            ))}
          </div>
          <button className="mt-4 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors" style={{ fontSize: "0.875rem" }}>+ Add Grade Level</button>
        </div>
      )}
      {activeTab === "subjects" && (
        <div className="bg-card border border-border rounded-xl p-6 max-w-2xl">
          <div className="space-y-2">
            {["Mathematics — Algebra, Calculus", "Science — Physics, Chemistry", "English — Literature, Grammar", "Social Studies — History, Geography", "Computer Science — Programming, Data Structures"].map(sub => (
              <div key={sub} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <span style={{ fontSize: "0.875rem" }}>{sub}</span><button className="text-muted-foreground hover:text-foreground" style={{ fontSize: "0.8125rem" }}>Edit</button>
              </div>
            ))}
          </div>
          <button className="mt-4 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors" style={{ fontSize: "0.875rem" }}>+ Add Subject</button>
        </div>
      )}
    </div>
  );
}
