import { useState } from "react";
import {
  MessageSquare,
  Send,
  Search,
  Plus,
  Archive,
  MailOpen,
  Mail,
  Paperclip,
  MoreVertical,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderInitials: string;
  body: string;
  timestamp: string;
  isMine: boolean;
}

interface Conversation {
  id: string;
  participantName: string;
  participantInitials: string;
  participantRole: string;
  subject: string;
  snippet: string;
  timestamp: string;
  unread: number;
  isArchived: boolean;
  isDraft: boolean;
  isSent: boolean;
  messages: Message[];
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv_1",
    participantName: "Dr. Sarah Johnson",
    participantInitials: "SJ",
    participantRole: "Head of English",
    subject: "Year 10 Essay Marks - Clarification",
    snippet:
      "Hi, could you confirm the marking criteria for the last essay? Several students have questions...",
    timestamp: "10:32 AM",
    unread: 2,
    isArchived: false,
    isDraft: false,
    isSent: false,
    messages: [
      {
        id: "m1",
        senderId: "usr_022",
        senderName: "Dr. Sarah Johnson",
        senderInitials: "SJ",
        body: "Hi, could you confirm the marking criteria for the last Year 10 essay? Several students have come to me with questions about their grades.",
        timestamp: "9:15 AM",
        isMine: false,
      },
      {
        id: "m2",
        senderId: "me",
        senderName: "Me",
        senderInitials: "ME",
        body: "Of course! The criteria focused on textual analysis (40%), structure (30%), and use of language (30%). I'll send over the full mark scheme shortly.",
        timestamp: "9:48 AM",
        isMine: true,
      },
      {
        id: "m3",
        senderId: "usr_022",
        senderName: "Dr. Sarah Johnson",
        senderInitials: "SJ",
        body: "Thank you, that's very helpful. Also, would it be possible to arrange a brief moderation session before we return the papers?",
        timestamp: "10:05 AM",
        isMine: false,
      },
      {
        id: "m4",
        senderId: "usr_022",
        senderName: "Dr. Sarah Johnson",
        senderInitials: "SJ",
        body: "Ideally sometime this week if you have availability. Let me know what works for you.",
        timestamp: "10:32 AM",
        isMine: false,
      },
    ],
  },
  {
    id: "conv_2",
    participantName: "Mr. James Okafor",
    participantInitials: "JO",
    participantRole: "Head of Year 9",
    subject: "Pastoral Concern - Alex Bennett",
    snippet:
      "I wanted to flag a pastoral concern regarding Alex Bennett in 9B...",
    timestamp: "Yesterday",
    unread: 0,
    isArchived: false,
    isDraft: false,
    isSent: false,
    messages: [
      {
        id: "m5",
        senderId: "usr_031",
        senderName: "Mr. James Okafor",
        senderInitials: "JO",
        body: "I wanted to flag a pastoral concern regarding Alex Bennett in 9B. He has been noticeably withdrawn in lessons over the past fortnight.",
        timestamp: "Yesterday 2:10 PM",
        isMine: false,
      },
      {
        id: "m6",
        senderId: "me",
        senderName: "Me",
        senderInitials: "ME",
        body: "Thanks for letting me know, James. I've also noticed a change. I'll arrange a welfare check-in with Alex tomorrow morning. Shall I copy you in on the outcome?",
        timestamp: "Yesterday 3:45 PM",
        isMine: true,
      },
      {
        id: "m7",
        senderId: "usr_031",
        senderName: "Mr. James Okafor",
        senderInitials: "JO",
        body: "Yes please. Also, I think we should loop in the SENCO given his existing provision. I'll send her a message separately.",
        timestamp: "Yesterday 4:02 PM",
        isMine: false,
      },
    ],
  },
  {
    id: "conv_3",
    participantName: "Mrs. Priya Patel",
    participantInitials: "PP",
    participantRole: "Parent",
    subject: "Re: Parents' Evening Appointment",
    snippet:
      "Thank you for confirming the slot. We will see you on Thursday at...",
    timestamp: "Mon",
    unread: 0,
    isArchived: false,
    isDraft: false,
    isSent: false,
    messages: [
      {
        id: "m8",
        senderId: "me",
        senderName: "Me",
        senderInitials: "ME",
        body: "Dear Mrs. Patel, I wanted to confirm your Parents' Evening appointment for Thursday 15th at 6:30 PM. Please come to Room 14.",
        timestamp: "Mon 9:00 AM",
        isMine: true,
      },
      {
        id: "m9",
        senderId: "usr_parent_1",
        senderName: "Mrs. Priya Patel",
        senderInitials: "PP",
        body: "Thank you for confirming the slot. We will see you on Thursday at 6:30 PM. My husband will also be attending if that's alright.",
        timestamp: "Mon 11:22 AM",
        isMine: false,
      },
    ],
  },
  {
    id: "conv_4",
    participantName: "Ms. Lauren Mills",
    participantInitials: "LM",
    participantRole: "SENCO",
    subject: "EHCP Review - Jade Thompson",
    snippet: "The annual EHCP review for Jade is due next month. Could we...",
    timestamp: "Mon",
    unread: 1,
    isArchived: false,
    isDraft: false,
    isSent: false,
    messages: [
      {
        id: "m10",
        senderId: "usr_senco",
        senderName: "Ms. Lauren Mills",
        senderInitials: "LM",
        body: "The annual EHCP review for Jade Thompson in Year 8 is due next month. Could we schedule a meeting with her form tutor and specialist teacher?",
        timestamp: "Mon 8:45 AM",
        isMine: false,
      },
    ],
  },
  {
    id: "conv_5",
    participantName: "Finance Office",
    participantInitials: "FO",
    participantRole: "Finance Team",
    subject: "Budget Request - Science Equipment",
    snippet:
      "Your budget request for £1,200 of science lab equipment has been...",
    timestamp: "Fri",
    unread: 0,
    isArchived: false,
    isDraft: false,
    isSent: false,
    messages: [
      {
        id: "m11",
        senderId: "me",
        senderName: "Me",
        senderInitials: "ME",
        body: "Please find attached a budget request for £1,200 to replace the ageing microscopes in Lab 3. The current ones are producing unreliable results.",
        timestamp: "Wed 10:00 AM",
        isMine: true,
      },
      {
        id: "m12",
        senderId: "usr_finance",
        senderName: "Finance Office",
        senderInitials: "FO",
        body: "Your budget request for £1,200 of science lab equipment has been reviewed and approved. Please raise a purchase order via the procurement system.",
        timestamp: "Fri 9:30 AM",
        isMine: false,
      },
    ],
  },
  {
    id: "conv_6",
    participantName: "IT Support",
    participantInitials: "IT",
    participantRole: "IT Team",
    subject: "Projector Fault - Room 7",
    snippet:
      "We've logged your ticket. A technician will visit during Period 3...",
    timestamp: "Thu",
    unread: 0,
    isArchived: true,
    isDraft: false,
    isSent: false,
    messages: [
      {
        id: "m13",
        senderId: "me",
        senderName: "Me",
        senderInitials: "ME",
        body: "The projector in Room 7 is displaying a flickering image when connected via HDMI. Could you arrange a repair before Friday?",
        timestamp: "Thu 8:00 AM",
        isMine: true,
      },
      {
        id: "m14",
        senderId: "usr_it",
        senderName: "IT Support",
        senderInitials: "IT",
        body: "We've logged your ticket (ref #4421). A technician will visit during Period 3 on Thursday. Please leave the room unlocked.",
        timestamp: "Thu 8:25 AM",
        isMine: false,
      },
    ],
  },
  {
    id: "conv_7",
    participantName: "Mr. Daniel Harris",
    participantInitials: "DH",
    participantRole: "Cover Supervisor",
    subject: "Cover Notes - Thursday 14th",
    snippet: "Draft cover notes prepared for your absence Thursday...",
    timestamp: "Wed",
    unread: 0,
    isArchived: false,
    isDraft: true,
    isSent: false,
    messages: [
      {
        id: "m15",
        senderId: "me",
        senderName: "Me",
        senderInitials: "ME",
        body: "Dear Daniel, please find the cover notes for Thursday 14th attached. Year 9B should complete pages 34-36 in their workbooks. Year 7A have a reading task on the shared drive.",
        timestamp: "Wed 4:30 PM",
        isMine: true,
      },
    ],
  },
  {
    id: "conv_8",
    participantName: "Admin Office",
    participantInitials: "AO",
    participantRole: "Administration",
    subject: "School Trip Permission - Confirmation",
    snippet:
      "This is to confirm that all permission forms for the Year 10 Geography field...",
    timestamp: "Tue",
    unread: 0,
    isArchived: false,
    isDraft: false,
    isSent: true,
    messages: [
      {
        id: "m16",
        senderId: "usr_admin",
        senderName: "Admin Office",
        senderInitials: "AO",
        body: "This is to confirm that all permission forms for the Year 10 Geography field trip on 22nd March have been received and processed. 28 of 30 students have paid.",
        timestamp: "Tue 11:00 AM",
        isMine: false,
      },
      {
        id: "m17",
        senderId: "me",
        senderName: "Me",
        senderInitials: "ME",
        body: "Thank you. Could you let me know which two students still have outstanding payments so I can follow up with their parents?",
        timestamp: "Tue 11:45 AM",
        isMine: true,
      },
    ],
  },
];

const AVATAR_COLOURS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-teal-500",
];

function avatarColor(initials: string) {
  const idx = initials.charCodeAt(0) % AVATAR_COLOURS.length;
  return AVATAR_COLOURS[idx];
}

function Avatar({
  initials,
  size = "md",
}: {
  initials: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-7 w-7 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-10 w-10 text-sm",
  };
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        avatarColor(initials),
        sizes[size],
      )}
    >
      {initials}
    </div>
  );
}

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedConvId, setSelectedConvId] = useState<string | null>("conv_1");
  const [conversations, setConversations] =
    useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [newTo, setNewTo] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newBody, setNewBody] = useState("");
  const [showMobileConversation, setShowMobileConversation] = useState(false);

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      !searchQuery ||
      c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "inbox"
        ? !c.isArchived && !c.isDraft && !c.isSent
        : activeTab === "sent"
          ? c.isSent
          : activeTab === "drafts"
            ? c.isDraft
            : c.isArchived;

    return matchesSearch && matchesTab;
  });

  const selectedConv = conversations.find((c) => c.id === selectedConvId);

  function handleSelectConv(convId: string) {
    setSelectedConvId(convId);
    setShowMobileConversation(true);
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, unread: 0 } : c)),
    );
  }

  function handleSendReply() {
    if (!replyText.trim() || !selectedConvId) return;
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      senderId: "me",
      senderName: "Me",
      senderInitials: "ME",
      body: replyText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMine: true,
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConvId
          ? { ...c, messages: [...c.messages, newMsg], snippet: replyText }
          : c,
      ),
    );
    setReplyText("");
    toast.success("Message sent");
  }

  function handleArchive(convId: string) {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, isArchived: true } : c)),
    );
    if (selectedConvId === convId) setSelectedConvId(null);
    toast.success("Conversation archived");
  }

  function handleMarkRead(convId: string, unread: boolean) {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, unread: unread ? 1 : 0 } : c)),
    );
  }

  function handleSendNew() {
    if (!newTo.trim() || !newSubject.trim() || !newBody.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      participantName: newTo,
      participantInitials: newTo
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      participantRole: "",
      subject: newSubject,
      snippet: newBody,
      timestamp: "Just now",
      unread: 0,
      isArchived: false,
      isDraft: false,
      isSent: true,
      messages: [
        {
          id: `m_${Date.now()}`,
          senderId: "me",
          senderName: "Me",
          senderInitials: "ME",
          body: newBody,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMine: true,
        },
      ],
    };
    setConversations((prev) => [newConv, ...prev]);
    setNewTo("");
    setNewSubject("");
    setNewBody("");
    setNewMessageOpen(false);
    toast.success("Message sent successfully");
  }

  const totalUnread = conversations.filter(
    (c) => !c.isArchived && !c.isDraft && !c.isSent && c.unread > 0,
  ).length;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Messages"
        subtitle={
          totalUnread > 0
            ? `${totalUnread} unread conversation${totalUnread > 1 ? "s" : ""}`
            : "All caught up"
        }
        icon={MessageSquare}
        iconColor="bg-blue-600"
        actions={[
          {
            label: "New Message",
            icon: Plus,
            onClick: () => setNewMessageOpen(true),
          },
        ]}
      />

      <div className="flex flex-1 overflow-hidden bg-gray-50">
        {/* Left panel */}
        <div
          className={cn(
            "flex flex-col w-full md:w-1/3 border-r border-gray-200 bg-white",
            showMobileConversation && "hidden md:flex",
          )}
        >
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm bg-gray-50"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="px-3 pt-2 pb-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full h-8 text-xs">
                <TabsTrigger value="inbox" className="flex-1 text-xs gap-1">
                  Inbox
                  {totalUnread > 0 && (
                    <span className="ml-0.5 bg-blue-600 text-white text-[10px] rounded-full px-1.5 py-0">
                      {totalUnread}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="sent" className="flex-1 text-xs">
                  Sent
                </TabsTrigger>
                <TabsTrigger value="drafts" className="flex-1 text-xs">
                  Drafts
                </TabsTrigger>
                <TabsTrigger value="archived" className="flex-1 text-xs">
                  Archived
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Conversation list */}
          <ScrollArea className="flex-1">
            <div className="divide-y divide-gray-50">
              {filteredConversations.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-400">
                  No messages
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConv(conv.id)}
                    className={cn(
                      "w-full flex items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-gray-50",
                      selectedConvId === conv.id &&
                        "bg-blue-50 border-l-2 border-l-blue-600",
                    )}
                  >
                    <Avatar initials={conv.participantInitials} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={cn(
                            "text-sm truncate",
                            conv.unread > 0
                              ? "font-semibold text-gray-900"
                              : "font-medium text-gray-700",
                          )}
                        >
                          {conv.participantName}
                        </span>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {conv.timestamp}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-xs truncate mt-0.5",
                          conv.unread > 0
                            ? "font-medium text-gray-800"
                            : "text-gray-500",
                        )}
                      >
                        {conv.subject}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {conv.snippet}
                      </p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="mt-1 shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white">
                        {conv.unread}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right panel – conversation view */}
        <div
          className={cn(
            "flex flex-col flex-1 bg-white",
            !showMobileConversation && "hidden md:flex",
          )}
        >
          {selectedConv ? (
            <>
              {/* Conversation header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                <button
                  className="md:hidden p-1 rounded hover:bg-gray-100"
                  onClick={() => setShowMobileConversation(false)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <Avatar initials={selectedConv.participantInitials} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedConv.participantName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedConv.participantRole} ·{" "}
                    <span className="italic">{selectedConv.subject}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={() => handleArchive(selectedConv.id)}
                  >
                    <Archive className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Archive</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          handleMarkRead(
                            selectedConv.id,
                            selectedConv.unread === 0,
                          )
                        }
                      >
                        {selectedConv.unread === 0 ? (
                          <>
                            <Mail className="h-4 w-4 mr-2" /> Mark as unread
                          </>
                        ) : (
                          <>
                            <MailOpen className="h-4 w-4 mr-2" /> Mark as read
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleArchive(selectedConv.id)}
                      >
                        <Archive className="h-4 w-4 mr-2" /> Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 px-4 py-4">
                <div className="space-y-3 max-w-2xl mx-auto">
                  {selectedConv.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex gap-2",
                        msg.isMine ? "flex-row-reverse" : "flex-row",
                      )}
                    >
                      {!msg.isMine && (
                        <Avatar initials={msg.senderInitials} size="sm" />
                      )}
                      <div
                        className={cn(
                          "max-w-[75%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                          msg.isMine
                            ? "bg-blue-600 text-white rounded-tr-sm"
                            : "bg-gray-100 text-gray-800 rounded-tl-sm",
                        )}
                      >
                        <p>{msg.body}</p>
                        <p
                          className={cn(
                            "text-[10px] mt-1",
                            msg.isMine ? "text-blue-100" : "text-gray-400",
                          )}
                        >
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Compose */}
              <div className="border-t border-gray-100 p-3">
                <div className="flex gap-2 items-end max-w-2xl mx-auto">
                  <Textarea
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[60px] max-h-[120px] text-sm resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                        handleSendReply();
                      }
                    }}
                  />
                  <div className="flex flex-col gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-400"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                      className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-1 max-w-2xl mx-auto">
                  Ctrl+Enter to send
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-gray-400">
              <MessageSquare className="h-10 w-10 text-gray-200" />
              <p className="text-sm">Select a conversation to read</p>
            </div>
          )}
        </div>
      </div>

      {/* New Message Dialog */}
      <Dialog open={newMessageOpen} onOpenChange={setNewMessageOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">To</label>
              <Input
                placeholder="Search for a user..."
                value={newTo}
                onChange={(e) => setNewTo(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Subject
              </label>
              <Input
                placeholder="Subject"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Message
              </label>
              <Textarea
                placeholder="Write your message..."
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                className="min-h-[120px] text-sm resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNewMessageOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSendNew} className="gap-1.5">
              <Send className="h-3.5 w-3.5" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
