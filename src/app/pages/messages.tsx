import { useState } from "react";
import { useOutletContext } from "react-router";
import { Send, MessageSquare } from "lucide-react";
import { EmptyState } from "../components/empty-state";
import { type Role } from "../data/mock-data";

interface Message {
  id: string;
  from: string;
  role: string;
  text: string;
  time: string;
  isMe: boolean;
}

const conversations = [
  { id: "c1", name: "Mr. John Williams", role: "Math Teacher", lastMessage: "Alice is doing great in class.", time: "10:30 AM", unread: 1 },
  { id: "c2", name: "Ms. Rachel Adams", role: "Science Teacher", lastMessage: "Lab report feedback attached.", time: "Yesterday", unread: 0 },
  { id: "c3", name: "Administration", role: "School Admin", lastMessage: "Parent-teacher meeting reminder.", time: "Feb 24", unread: 0 },
];

const chatMessages: Message[] = [
  { id: "m1", from: "Mr. John Williams", role: "Teacher", text: "Hello! I wanted to let you know that Alice has been performing excellently in Algebra this term.", time: "10:15 AM", isMe: false },
  { id: "m2", from: "You", role: "", text: "That's wonderful to hear! She's been studying hard.", time: "10:20 AM", isMe: true },
  { id: "m3", from: "Mr. John Williams", role: "Teacher", text: "She scored 92/100 on the latest test. Alice is doing great in class.", time: "10:30 AM", isMe: false },
];

export default function MessagesPage() {
  const { role } = useOutletContext<{ role: Role }>();
  const [selectedConvo, setSelectedConvo] = useState<string | null>("c1");
  const [messageText, setMessageText] = useState("");

  return (
    <div>
      <div className="mb-6">
        <h1>Messages</h1>
        <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
          {role === "parent" ? "Communicate with your child's teachers." : "Staff and parent messaging."}
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden" style={{ height: "calc(100vh - 220px)", minHeight: "400px" }}>
        <div className="flex h-full">
          {/* Conversation List */}
          <div className={`w-full sm:w-80 border-r border-border flex flex-col shrink-0 ${selectedConvo ? "hidden sm:flex" : "flex"}`}>
            <div className="p-3 border-b border-border">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full px-3 py-2 rounded-lg border border-border bg-input-background"
                style={{ fontSize: "0.875rem" }}
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedConvo(c.id)}
                  className={`w-full text-left p-4 border-b border-border hover:bg-muted/50 transition-colors ${
                    selectedConvo === c.id ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{c.name.split(" ").slice(-1)[0][0]}{c.name.split(" ").slice(-2)[0][0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="truncate" style={{ fontWeight: 500, fontSize: "0.875rem" }}>{c.name}</p>
                        <span className="text-muted-foreground shrink-0 ml-2" style={{ fontSize: "0.75rem" }}>{c.time}</span>
                      </div>
                      <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{c.role}</p>
                      <p className="text-muted-foreground truncate mt-0.5" style={{ fontSize: "0.8125rem" }}>{c.lastMessage}</p>
                    </div>
                    {c.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0" style={{ fontSize: "0.7rem" }}>{c.unread}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${selectedConvo ? "flex" : "hidden sm:flex"}`}>
            {selectedConvo ? (
              <>
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <button onClick={() => setSelectedConvo(null)} className="sm:hidden p-1 rounded-md hover:bg-muted" style={{ fontSize: "0.875rem" }}>
                    &larr;
                  </button>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>JW</span>
                  </div>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>Mr. John Williams</p>
                    <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Math Teacher</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-xl px-4 py-2.5 ${
                        msg.isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}>
                        <p style={{ fontSize: "0.875rem" }}>{msg.text}</p>
                        <p className={`mt-1 ${msg.isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`} style={{ fontSize: "0.7rem" }}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-input-background"
                      style={{ fontSize: "0.875rem" }}
                    />
                    <button className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <EmptyState
                icon={<MessageSquare className="w-6 h-6 text-muted-foreground" />}
                title="Select a conversation"
                description="Choose a conversation from the list to start messaging."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}