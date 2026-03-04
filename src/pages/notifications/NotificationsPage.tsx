import { useEffect, useState, type ElementType } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  MessageSquare,
  ClipboardList,
  Settings,
  ShieldAlert,
  Megaphone,
  CalendarCheck,
  Trash2,
  BookOpen,
} from "lucide-react";
import { useNotificationStore } from "@/stores/notificationStore";
import { PageHeader } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared";
import { cn } from "@/lib/utils";
import type { Notification, NotificationType } from "@/types";

// ─── Mock seed data ────────────────────────────────────────────────────────────

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif_001",
    userId: "usr_001",
    organisationId: "org_001",
    type: "ATTENDANCE",
    title: "Attendance alert: Tyler Barnes",
    body: "Tyler Barnes (Year 10) has been absent for 3 consecutive days. A welfare call may be required.",
    link: "/attendance",
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    id: "notif_002",
    userId: "usr_001",
    organisationId: "org_001",
    type: "SAFEGUARDING",
    title: "Safeguarding referral submitted",
    body: "A new safeguarding referral has been submitted for Aisha Patel (Year 8). Review required by end of day.",
    link: "/safeguarding",
    createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
  },
  {
    id: "notif_003",
    userId: "usr_001",
    organisationId: "org_001",
    type: "MESSAGE",
    title: "New message from Sarah Whitfield",
    body: "Hi, can you please update the staff rota for next week before 3pm today? Thanks.",
    link: "/messages",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "notif_004",
    userId: "usr_001",
    organisationId: "org_001",
    type: "SYSTEM",
    title: "System update scheduled",
    body: "SETU will undergo a brief maintenance window tonight at 11:00 PM. Expected downtime: 15 minutes.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    readAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "notif_005",
    userId: "usr_001",
    organisationId: "org_001",
    type: "ASSIGNMENT",
    title: "Assignment deadline approaching",
    body: "Shakespeare Essay (7A) is due tomorrow. 7 students have not yet submitted.",
    link: "/assignments",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "notif_006",
    userId: "usr_001",
    organisationId: "org_001",
    type: "ANNOUNCEMENT",
    title: "Staff briefing reminder",
    body: "Whole-school staff briefing tomorrow morning at 8:15 AM in the main hall. Attendance required.",
    link: "/announcements",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
  },
  {
    id: "notif_007",
    userId: "usr_001",
    organisationId: "org_001",
    type: "INCIDENT",
    title: "New incident report filed",
    body: "A new behaviour incident has been logged for Marcus Williams (Year 9) by Thomas James.",
    link: "/incidents",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "notif_008",
    userId: "usr_001",
    organisationId: "org_001",
    type: "ATTENDANCE",
    title: "Attendance below threshold",
    body: "Year 11 overall attendance has dropped to 88.4% this week, below the 90% threshold.",
    link: "/attendance",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "notif_009",
    userId: "usr_001",
    organisationId: "org_001",
    type: "GRADE",
    title: "Grade entry deadline: Friday",
    body: "Please ensure all end-of-term grades are entered by Friday, 7 March at 5:00 PM.",
    link: "/grades",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
  },
  {
    id: "notif_010",
    userId: "usr_001",
    organisationId: "org_001",
    type: "MESSAGE",
    title: "New message from Anita Patel",
    body: "Could you check in with Callum Robinson this morning? His parents reached out.",
    link: "/messages",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "notif_011",
    userId: "usr_001",
    organisationId: "org_001",
    type: "SYSTEM",
    title: "New feature: Bulk attendance export",
    body: "You can now export attendance records in bulk from the Attendance module. Try it out!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
  },
  {
    id: "notif_012",
    userId: "usr_001",
    organisationId: "org_001",
    type: "SAFEGUARDING",
    title: "Safeguarding training reminder",
    body: "Your annual safeguarding refresher training is due by 31 March. Please complete via CPD portal.",
    link: "/staff",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "notif_013",
    userId: "usr_001",
    organisationId: "org_001",
    type: "ASSIGNMENT",
    title: "Assignment marked: 8B Creative Writing",
    body: "Thomas James has returned grades for Creative Writing Portfolio (8B). 22 out of 28 grades entered.",
    link: "/assignments",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: "notif_014",
    userId: "usr_001",
    organisationId: "org_001",
    type: "ANNOUNCEMENT",
    title: "Fire drill scheduled: Thursday",
    body: "Fire drill will take place on Thursday, 6 March at 10:30 AM. All staff to follow evacuation procedures.",
    link: "/announcements",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: "notif_015",
    userId: "usr_001",
    organisationId: "org_001",
    type: "ATTENDANCE",
    title: "Late registration: Period 3",
    body: "15 students in Year 7 had unregistered sessions during Period 3 this morning.",
    link: "/attendance",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
  {
    id: "notif_016",
    userId: "usr_001",
    organisationId: "org_001",
    type: "INCIDENT",
    title: "Incident escalated to SLT",
    body: "The safeguarding concern for Aisha Patel has been escalated. SLT review meeting at 2:00 PM.",
    link: "/incidents",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 32).toISOString(),
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "notif_017",
    userId: "usr_001",
    organisationId: "org_001",
    type: "SYSTEM",
    title: "Password expiry notice",
    body: "Your SETU account password will expire in 14 days. Please update it in your security settings.",
    link: "/settings",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: "notif_018",
    userId: "usr_001",
    organisationId: "org_001",
    type: "GRADE",
    title: "Assessment results published",
    body: "Year 9 mid-year assessment results have been published. Students can now view their results.",
    link: "/grades",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: "notif_019",
    userId: "usr_001",
    organisationId: "org_001",
    type: "MESSAGE",
    title: "Parent message: Emma Clarke",
    body: "Emma Clarke's parent has sent a message regarding her recent absence. Please review.",
    link: "/messages",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
  },
  {
    id: "notif_020",
    userId: "usr_001",
    organisationId: "org_001",
    type: "ANNOUNCEMENT",
    title: "Welcome back after half term",
    body: "Welcome back everyone! Please remember to check the updated code of conduct and staff handbook sections.",
    link: "/announcements",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
  },
];

// ─── Type config ───────────────────────────────────────────────────────────────

type FilterTab = "all" | "unread" | "mentions" | "system";

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: ElementType; bg: string; text: string }
> = {
  ATTENDANCE: { icon: CalendarCheck, bg: "bg-blue-100", text: "text-blue-600" },
  SAFEGUARDING: { icon: ShieldAlert, bg: "bg-red-100", text: "text-red-600" },
  MESSAGE: { icon: MessageSquare, bg: "bg-green-100", text: "text-green-600" },
  SYSTEM: { icon: Settings, bg: "bg-gray-100", text: "text-gray-600" },
  ASSIGNMENT: {
    icon: ClipboardList,
    bg: "bg-purple-100",
    text: "text-purple-600",
  },
  ANNOUNCEMENT: { icon: Megaphone, bg: "bg-amber-100", text: "text-amber-600" },
  INCIDENT: {
    icon: AlertTriangle,
    bg: "bg-orange-100",
    text: "text-orange-600",
  },
  GRADE: { icon: BookOpen, bg: "bg-indigo-100", text: "text-indigo-600" },
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    setNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  // Seed mock data if empty
  useEffect(() => {
    if (notifications.length === 0) {
      setNotifications(MOCK_NOTIFICATIONS);
    }
  }, []);

  const filtered = notifications.filter((n) => {
    if (activeTab === "unread") return !n.readAt;
    if (activeTab === "system") return n.type === "SYSTEM";
    if (activeTab === "mentions") return n.type === "MESSAGE";
    return true;
  });

  const tabs: { id: FilterTab; label: string; count?: number }[] = [
    { id: "all", label: "All", count: notifications.length },
    { id: "unread", label: "Unread", count: unreadCount },
    { id: "mentions", label: "Messages" },
    { id: "system", label: "System" },
  ];

  function relativeTime(iso: string) {
    try {
      return formatDistanceToNow(new Date(iso), { addSuffix: true });
    } catch {
      return "recently";
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Notifications"
        subtitle={
          unreadCount > 0
            ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
            : "All caught up"
        }
        icon={Bell}
        iconColor="bg-blue-600"
        actions={[
          {
            label: "Mark all read",
            onClick: markAllAsRead,
            icon: CheckCheck,
            variant: "outline",
            disabled: unreadCount === 0,
          },
        ]}
      />

      <div className="flex flex-col flex-1 p-6 gap-4 max-w-3xl">
        {/* Filter tabs */}
        <div className="flex items-center gap-1 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700",
              )}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={cn(
                    "inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-xs",
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-500",
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <EmptyState
            title="No notifications"
            description={
              activeTab === "unread"
                ? "You're all caught up! No unread notifications."
                : "Nothing to show here yet."
            }
            icon={Bell}
          />
        ) : (
          <div className="space-y-1">
            {filtered.map((notif) => {
              const config = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.SYSTEM;
              const TypeIcon = config.icon;
              const isUnread = !notif.readAt;

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (isUnread) markAsRead(notif.id);
                  }}
                  className={cn(
                    "group flex items-start gap-3 rounded-xl border p-3.5 transition-all cursor-pointer",
                    isUnread
                      ? "bg-blue-50/60 border-blue-100 hover:bg-blue-50"
                      : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/50",
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl mt-0.5",
                      config.bg,
                    )}
                  >
                    <TypeIcon
                      className={cn(
                        "h-4.5 w-4.5",
                        config.text,
                        "h-[18px] w-[18px]",
                      )}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm leading-snug",
                          isUnread
                            ? "font-semibold text-gray-900"
                            : "font-medium text-gray-700",
                        )}
                      >
                        {notif.title}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {relativeTime(notif.createdAt)}
                        </span>
                        {isUnread && (
                          <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                      {notif.body}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="outline" className="text-xs py-0 h-5">
                        {notif.type.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                    title="Delete notification"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
