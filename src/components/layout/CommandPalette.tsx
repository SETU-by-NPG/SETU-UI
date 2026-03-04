import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowRight,
  Home,
  Users,
  Calendar,
  CheckSquare,
  AlertTriangle,
} from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";

const COMMANDS = [
  { label: "Dashboard", path: "/dashboard", icon: Home, category: "Pages" },
  { label: "Students", path: "/students", icon: Users, category: "Pages" },
  { label: "Timetable", path: "/timetable", icon: Calendar, category: "Pages" },
  {
    label: "Attendance",
    path: "/attendance",
    icon: CheckSquare,
    category: "Pages",
  },
  {
    label: "Behaviour & Incidents",
    path: "/incidents",
    icon: AlertTriangle,
    category: "Pages",
  },
  { label: "Staff Directory", path: "/staff", icon: Users, category: "Pages" },
  { label: "Messages", path: "/messages", icon: Home, category: "Pages" },
  {
    label: "Announcements",
    path: "/announcements",
    icon: Home,
    category: "Pages",
  },
  { label: "Grades", path: "/grades", icon: Home, category: "Pages" },
  { label: "Assignments", path: "/assignments", icon: Home, category: "Pages" },
  { label: "Library", path: "/library", icon: Home, category: "Pages" },
  { label: "Admissions", path: "/admissions", icon: Home, category: "Pages" },
  { label: "Finance", path: "/finance", icon: Home, category: "Pages" },
  { label: "HR", path: "/hr", icon: Home, category: "Pages" },
  { label: "Facilities", path: "/facilities", icon: Home, category: "Pages" },
  { label: "Careers", path: "/careers", icon: Home, category: "Pages" },
  { label: "Reports", path: "/reports", icon: Home, category: "Pages" },
  { label: "IT Admin", path: "/it-admin", icon: Home, category: "Pages" },
  { label: "Settings", path: "/settings", icon: Home, category: "Pages" },
  {
    label: "Safeguarding",
    path: "/safeguarding",
    icon: Home,
    category: "Pages",
  },
  { label: "SEN Register", path: "/sen", icon: Home, category: "Pages" },
  {
    label: "Examinations",
    path: "/examinations",
    icon: Home,
    category: "Pages",
  },
];

export function CommandPalette() {
  const { commandPaletteOpen, closeCommandPalette } = useUIStore();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? COMMANDS.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase()),
      )
    : COMMANDS.slice(0, 8);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        commandPaletteOpen
          ? closeCommandPalette()
          : useUIStore.getState().openCommandPalette();
      }
      if (!commandPaletteOpen) return;
      if (e.key === "Escape") closeCommandPalette();
      if (e.key === "ArrowDown")
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      if (e.key === "ArrowUp") setSelectedIndex((i) => Math.max(i - 1, 0));
      if (e.key === "Enter" && filtered[selectedIndex]) {
        navigate(filtered[selectedIndex].path);
        closeCommandPalette();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [
    commandPaletteOpen,
    filtered,
    selectedIndex,
    navigate,
    closeCommandPalette,
  ]);

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeCommandPalette}
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden animate-fade-in">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search pages, students, staff..."
            className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
          <kbd className="inline-flex h-5 items-center gap-1 rounded border border-gray-200 px-1.5 font-mono text-[10px] text-gray-500">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="py-1 max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              No results found
            </div>
          ) : (
            <>
              <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Pages
              </div>
              {filtered.map((cmd, i) => (
                <button
                  key={cmd.path}
                  onClick={() => {
                    navigate(cmd.path);
                    closeCommandPalette();
                  }}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                    i === selectedIndex
                      ? "bg-primary/5 text-primary"
                      : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  <cmd.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left">{cmd.label}</span>
                  {i === selectedIndex && (
                    <ArrowRight className="h-3.5 w-3.5 text-primary" />
                  )}
                </button>
              ))}
            </>
          )}
        </div>

        <div className="border-t border-gray-100 px-4 py-2 flex items-center gap-4 text-[10px] text-gray-400">
          <span className="flex items-center gap-1">
            <kbd className="border rounded px-1">↑↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="border rounded px-1">↵</kbd> open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="border rounded px-1">esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
