import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  isOffline: boolean;
  compactMode: boolean;
  recentSearches: string[];
  activeModules: Record<string, boolean>;
  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleOffline: () => void;
  toggleCompactMode: () => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  toggleModule: (moduleName: string) => void;
  setModuleActive: (moduleName: string, active: boolean) => void;
}

const defaultModules: Record<string, boolean> = {
  students: true,
  staff: true,
  timetable: true,
  attendance: true,
  grades: true,
  assignments: true,
  library: true,
  incidents: true,
  safeguarding: true,
  sen: true,
  admissions: true,
  examinations: true,
  careers: true,
  finance: true,
  hr: true,
  facilities: true,
  itAdmin: true,
  auditLogs: true,
  reports: true,
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      commandPaletteOpen: false,
      isOffline: false,
      compactMode: false,
      recentSearches: [],
      activeModules: defaultModules,

      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      openCommandPalette: () => set({ commandPaletteOpen: true }),
      closeCommandPalette: () => set({ commandPaletteOpen: false }),
      toggleOffline: () => set((s) => ({ isOffline: !s.isOffline })),
      toggleCompactMode: () => set((s) => ({ compactMode: !s.compactMode })),
      addRecentSearch: (query) =>
        set((s) => ({
          recentSearches: [
            query,
            ...s.recentSearches.filter((q) => q !== query),
          ].slice(0, 5),
        })),
      clearRecentSearches: () => set({ recentSearches: [] }),
      toggleModule: (moduleName) =>
        set((s) => ({
          activeModules: {
            ...s.activeModules,
            [moduleName]: !s.activeModules[moduleName],
          },
        })),
      setModuleActive: (moduleName, active) =>
        set((s) => ({
          activeModules: { ...s.activeModules, [moduleName]: active },
        })),
    }),
    {
      name: "setu-ui",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        compactMode: state.compactMode,
        recentSearches: state.recentSearches,
        activeModules: state.activeModules,
      }),
    },
  ),
);
