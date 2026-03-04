import { useState } from "react";
import {
  Megaphone,
  Pin,
  Plus,
  ChevronDown,
  ChevronUp,
  Calendar,
  Globe,
  Users,
  BookOpen,
  Home,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { RoleGuard } from "@/components/shared/RoleGuard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AnnouncementCategory =
  | "SCHOOL_WIDE"
  | "YEAR_GROUP"
  | "DEPARTMENT"
  | "PARENTS"
  | "STAFF";

interface Announcement {
  id: string;
  title: string;
  category: AnnouncementCategory;
  excerpt: string;
  fullBody: string;
  authorName: string;
  authorInitials: string;
  date: string;
  isPinned: boolean;
  targetAudiences: string[];
}

const CATEGORY_CONFIG: Record<
  AnnouncementCategory,
  {
    label: string;
    variant: "default" | "success" | "warning" | "info" | "purple" | "ghost";
    icon: React.ElementType;
  }
> = {
  SCHOOL_WIDE: { label: "School-wide", variant: "default", icon: Globe },
  YEAR_GROUP: { label: "Year Group", variant: "info", icon: Users },
  DEPARTMENT: { label: "Department", variant: "purple", icon: BookOpen },
  PARENTS: { label: "Parents", variant: "success", icon: Home },
  STAFF: { label: "Staff", variant: "warning", icon: Users },
};

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann_1",
    title: "GCSE Mock Examination Timetable Published",
    category: "SCHOOL_WIDE",
    excerpt:
      "The timetable for the upcoming mock GCSE examinations has been published on the school portal. All Year 10 and Year 11 students must review their personal timetables.",
    fullBody:
      "The timetable for the upcoming mock GCSE examinations has been published on the school portal. All Year 10 and Year 11 students must review their personal timetables.\n\nExaminations will run from Monday 10th March to Friday 21st March. Students should arrive at their allocated examination room 10 minutes before the scheduled start time. Pencil cases must contain only approved materials.\n\nAny student with access arrangements should check with the Examinations Officer to confirm their venue. If you have any queries, please contact the school office.",
    authorName: "Mrs. Susan Clark",
    authorInitials: "SC",
    date: "Today, 8:30 AM",
    isPinned: true,
    targetAudiences: ["Students", "Parents", "Staff"],
  },
  {
    id: "ann_2",
    title: "School closure - Staff Training Day - 28th March",
    category: "SCHOOL_WIDE",
    excerpt:
      "Please be advised that the school will be closed to students on Friday 28th March for a whole-school staff training and CPD day.",
    fullBody:
      "Please be advised that the school will be closed to students on Friday 28th March for a whole-school staff training and CPD day. The programme for the day will be circulated to all staff via email by the end of this week.\n\nParents are reminded to make appropriate childcare arrangements. The school office will remain open from 8:00 AM – 12:00 PM for any essential queries.",
    authorName: "Mr. Robert Andrews",
    authorInitials: "RA",
    date: "Today, 7:45 AM",
    isPinned: true,
    targetAudiences: ["Students", "Parents", "Staff"],
  },
  {
    id: "ann_3",
    title: "Year 9 Options Evening - Thursday 6th March",
    category: "YEAR_GROUP",
    excerpt:
      "Year 9 parents and students are invited to the Options Evening on Thursday 6th March from 6:00 PM – 8:00 PM in the Main Hall.",
    fullBody:
      "Year 9 parents and students are invited to the Options Evening on Thursday 6th March from 6:00 PM – 8:00 PM in the Main Hall.\n\nHeads of Department will be available to discuss GCSE subject choices, career pathways, and examination expectations. Students will receive their options booklet beforehand.\n\nPlease RSVP via the school portal by Monday 3rd March so we can plan seating adequately.",
    authorName: "Mr. James Okafor",
    authorInitials: "JO",
    date: "Yesterday, 3:15 PM",
    isPinned: false,
    targetAudiences: ["Year 9", "Parents"],
  },
  {
    id: "ann_4",
    title: "English Department - New Scheme of Work - Spring Term",
    category: "DEPARTMENT",
    excerpt:
      "The updated English Scheme of Work for Spring Term is now available on the shared drive. All English teachers should review the revised assessment points.",
    fullBody:
      "The updated English Scheme of Work for Spring Term is now available in the shared drive under Departments > English > 2025-26 > Spring.\n\nKey changes include: revised assessment checkpoints at Week 4 and Week 8, updated reading lists for Years 7–9, and new guided reading resources for lower ability sets.\n\nPlease review before the next department meeting on Wednesday 5th March. Any comments or concerns should be raised with the Head of Department.",
    authorName: "Dr. Sarah Johnson",
    authorInitials: "SJ",
    date: "Yesterday, 9:00 AM",
    isPinned: false,
    targetAudiences: ["Department Staff"],
  },
  {
    id: "ann_5",
    title: "Parent Governor Vacancy",
    category: "PARENTS",
    excerpt:
      "We currently have a vacancy for a Parent Governor. This is a voluntary role and an invaluable opportunity to contribute to strategic decisions at the school.",
    fullBody:
      "We currently have a vacancy for a Parent Governor on the school's Governing Body. This is a voluntary role and an invaluable opportunity to support and challenge the school's leadership in its strategic direction.\n\nMeetings are held approximately six times per year in the evening. No prior governance experience is necessary – full training and support is provided.\n\nIf you are interested, please contact the Clerk to Governors at governors@setuschool.edu by 14th March.",
    authorName: "Mrs. Susan Clark",
    authorInitials: "SC",
    date: "Mon, 10:00 AM",
    isPinned: false,
    targetAudiences: ["Parents"],
  },
  {
    id: "ann_6",
    title: "Uniform Policy Reminder",
    category: "SCHOOL_WIDE",
    excerpt:
      "As we return from half term, we are reminding all students of the expectation to wear full school uniform every day.",
    fullBody:
      "As we return from half term, we are reminding all students of the expectation to wear full school uniform every day, including correct footwear and the school tie.\n\nForm tutors will be conducting uniform checks during morning registration from Monday. Students who are out of uniform without a valid reason will be asked to contact their parents/carers.\n\nFull uniform expectations are available on the school website.",
    authorName: "Mr. Robert Andrews",
    authorInitials: "RA",
    date: "Mon, 8:00 AM",
    isPinned: false,
    targetAudiences: ["Students", "Parents"],
  },
  {
    id: "ann_7",
    title: "Staff Wellbeing Survey - Please Respond by Friday",
    category: "STAFF",
    excerpt:
      "The annual staff wellbeing survey is now live. All staff are asked to complete it by this Friday. Your responses are anonymous.",
    fullBody:
      "The annual staff wellbeing survey is now live and will close on Friday 7th March at 5:00 PM. All teaching and support staff are asked to participate.\n\nYour responses are completely anonymous and will be used to inform the school's wellbeing action plan for the remainder of the academic year.\n\nThe link has been sent to your school email address. If you have not received it, please contact HR.",
    authorName: "Ms. Helen Wright",
    authorInitials: "HW",
    date: "Fri, 9:30 AM",
    isPinned: false,
    targetAudiences: ["Staff"],
  },
  {
    id: "ann_8",
    title: "Science Week Competition – Entries Now Open",
    category: "SCHOOL_WIDE",
    excerpt:
      "Students are invited to enter the Science Week competition. This year's theme is 'Sustainability and Innovation'. Prizes include a trip to the Science Museum.",
    fullBody:
      "Students are invited to enter the Science Week competition running from 17th–21st March. This year's theme is 'Sustainability and Innovation'.\n\nEntries can take the form of a poster, an experiment, a short video, or an engineering model. All entries must be submitted to the Science Department by 14th March.\n\nPrizes include: 1st place for each year group wins a trip to the Science Museum, London. Certificates will be awarded to all participants.",
    authorName: "Mr. Kevin Frost",
    authorInitials: "KF",
    date: "Thu, 2:00 PM",
    isPinned: false,
    targetAudiences: ["Students", "Staff"],
  },
  {
    id: "ann_9",
    title: "Canteen Menu Update – New Allergen Information",
    category: "SCHOOL_WIDE",
    excerpt:
      "The canteen has updated its menu for the Spring term. Updated allergen information for all dishes is now displayed on the canteen boards and school portal.",
    fullBody:
      "The canteen has introduced a revised menu for the Spring term, featuring new hot meal options and an expanded salad bar.\n\nImportantly, updated allergen information for all dishes is now displayed on the canteen boards and on the school portal under School Life > Canteen.\n\nParents or students with specific dietary requirements or allergies should contact the catering manager directly at catering@setuschool.edu.",
    authorName: "Admin Office",
    authorInitials: "AO",
    date: "Wed, 11:00 AM",
    isPinned: false,
    targetAudiences: ["Students", "Parents", "Staff"],
  },
  {
    id: "ann_10",
    title: "Year 7 Settling-In Survey – Parent Input Requested",
    category: "PARENTS",
    excerpt:
      "We would welcome feedback from parents of Year 7 students on how well their child has settled into the school. The survey takes approximately five minutes.",
    fullBody:
      "As we reach the midpoint of the school year, we would welcome feedback from parents and carers of Year 7 students on how well their child has settled into life at Setu School.\n\nThe short survey (approximately five minutes) covers academic confidence, friendships, extracurricular engagement, and any support needs.\n\nPlease complete the survey via the parent portal by 10th March. Your responses will be shared with Year 7 tutors and the Head of Year.",
    authorName: "Mr. James Okafor",
    authorInitials: "JO",
    date: "Tue, 4:00 PM",
    isPinned: false,
    targetAudiences: ["Parents"],
  },
];

const FILTER_TABS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "SCHOOL_WIDE", label: "School-wide" },
  { key: "YEAR_GROUP", label: "Year Group" },
  { key: "DEPARTMENT", label: "Department" },
  { key: "PARENTS", label: "Parents" },
  { key: "STAFF", label: "Staff" },
];

const AVATAR_COLOURS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
];

function authorAvatarColor(initials: string) {
  return AVATAR_COLOURS[initials.charCodeAt(0) % AVATAR_COLOURS.length];
}

function AnnouncementCard({
  ann,
  onPin,
}: {
  ann: Announcement;
  onPin: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const catConfig = CATEGORY_CONFIG[ann.category];
  const CatIcon = catConfig.icon;

  return (
    <Card
      className={`p-4 transition-shadow hover:shadow-sm ${ann.isPinned ? "border-l-4 border-l-amber-400" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${authorAvatarColor(ann.authorInitials)}`}
        >
          {ann.authorInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {ann.isPinned && (
                  <span title="Pinned">
                    <Pin className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
                  </span>
                )}
                <h3 className="text-sm font-semibold text-gray-900 leading-snug">
                  {ann.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant={catConfig.variant} className="gap-1">
                  <CatIcon className="h-3 w-3" />
                  {catConfig.label}
                </Badge>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {ann.date}
                </span>
                <span className="text-xs text-gray-500">{ann.authorName}</span>
              </div>
            </div>
            <RoleGuard
              roles={[
                "MASTER_ADMIN",
                "HEAD_OF_SCHOOL",
                "SLT_MEMBER",
                "HEAD_OF_DEPARTMENT",
                "HEAD_OF_YEAR",
                "DATA_MANAGER",
                "TEACHER",
              ]}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 shrink-0"
                onClick={() => onPin(ann.id)}
                title={ann.isPinned ? "Unpin" : "Pin"}
              >
                <Pin
                  className={`h-3.5 w-3.5 ${ann.isPinned ? "text-amber-500 fill-amber-400" : "text-gray-300"}`}
                />
              </Button>
            </RoleGuard>
          </div>

          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            {expanded
              ? ann.fullBody.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))
              : ann.excerpt}
          </p>

          <Button
            variant="ghost"
            size="sm"
            className="mt-1 h-6 px-0 text-xs text-blue-600 hover:text-blue-700 hover:bg-transparent gap-1"
            onClick={() => setExpanded((p) => !p)}
          >
            {expanded ? (
              <>
                Show less <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Read more <ChevronDown className="h-3 w-3" />
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function AnnouncementsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [postDialogOpen, setPostDialogOpen] = useState(false);

  // New announcement form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] =
    useState<AnnouncementCategory>("SCHOOL_WIDE");
  const [newBody, setNewBody] = useState("");
  const [newAudiences, setNewAudiences] = useState<string[]>(["Students"]);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");

  const filtered = announcements
    .filter((a) => activeFilter === "all" || a.category === activeFilter)
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  function handlePin(id: string) {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a)),
    );
  }

  function handlePost() {
    if (!newTitle.trim() || !newBody.trim()) {
      toast.error("Please provide a title and body for the announcement");
      return;
    }
    const newAnn: Announcement = {
      id: `ann_${Date.now()}`,
      title: newTitle,
      category: newCategory,
      excerpt: newBody.slice(0, 150) + (newBody.length > 150 ? "..." : ""),
      fullBody: newBody,
      authorName: "You",
      authorInitials: "YO",
      date:
        scheduleEnabled && scheduleDate
          ? `Scheduled: ${scheduleDate}`
          : "Just now",
      isPinned: false,
      targetAudiences: newAudiences,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    setNewTitle("");
    setNewCategory("SCHOOL_WIDE");
    setNewBody("");
    setNewAudiences(["Students"]);
    setScheduleEnabled(false);
    setScheduleDate("");
    setPostDialogOpen(false);
    toast.success("Announcement posted successfully");
  }

  function toggleAudience(audience: string) {
    setNewAudiences((prev) =>
      prev.includes(audience)
        ? prev.filter((a) => a !== audience)
        : [...prev, audience],
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Announcements"
        subtitle={`${announcements.length} announcements`}
        icon={Megaphone}
        iconColor="bg-amber-500"
      >
        <RoleGuard
          roles={[
            "MASTER_ADMIN",
            "HEAD_OF_SCHOOL",
            "SLT_MEMBER",
            "HEAD_OF_DEPARTMENT",
            "HEAD_OF_YEAR",
            "DATA_MANAGER",
            "TEACHER",
            "HR_MANAGER",
          ]}
        >
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => setPostDialogOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Post Announcement
          </Button>
        </RoleGuard>
      </PageHeader>

      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        {/* Filter tabs */}
        <div className="mb-5 flex gap-1.5 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeFilter === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Announcement cards */}
        <div className="space-y-3 max-w-3xl">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400 bg-white rounded-xl border border-gray-200">
              No announcements in this category
            </div>
          ) : (
            filtered.map((ann) => (
              <AnnouncementCard key={ann.id} ann={ann} onPin={handlePin} />
            ))
          )}
        </div>
      </div>

      {/* Post Announcement Dialog */}
      <Dialog open={postDialogOpen} onOpenChange={setPostDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Post Announcement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Title</Label>
              <Input
                placeholder="Announcement title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Category</Label>
              <Select
                value={newCategory}
                onValueChange={(v) => setNewCategory(v as AnnouncementCategory)}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>
                      {cfg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Target Audience</Label>
              <div className="flex flex-wrap gap-3">
                {[
                  "Students",
                  "Parents",
                  "Staff",
                  "Year 7",
                  "Year 8",
                  "Year 9",
                  "Year 10",
                  "Year 11",
                ].map((aud) => (
                  <div key={aud} className="flex items-center gap-1.5">
                    <Checkbox
                      id={`aud_${aud}`}
                      checked={newAudiences.includes(aud)}
                      onCheckedChange={() => toggleAudience(aud)}
                      className="h-3.5 w-3.5"
                    />
                    <label
                      htmlFor={`aud_${aud}`}
                      className="text-xs text-gray-700 cursor-pointer"
                    >
                      {aud}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Body</Label>
              <Textarea
                placeholder="Write your announcement..."
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                className="min-h-[120px] text-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="schedule-toggle"
                  checked={scheduleEnabled}
                  onCheckedChange={setScheduleEnabled}
                />
                <Label
                  htmlFor="schedule-toggle"
                  className="text-xs font-medium"
                >
                  Schedule for later
                </Label>
              </div>
              {scheduleEnabled && (
                <Input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="h-8 text-sm"
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPostDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handlePost} className="gap-1.5">
              <Megaphone className="h-3.5 w-3.5" />
              {scheduleEnabled ? "Schedule" : "Post Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
