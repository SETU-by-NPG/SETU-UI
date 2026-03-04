import { create } from "zustand";
import type { Notification } from "@/types";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  // Actions
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">,
  ) => void;
  deleteNotification: (id: string) => void;
  deleteAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) => {
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.readAt).length,
    });
  },

  markAsRead: (id) => {
    set((s) => {
      const updated = s.notifications.map((n) =>
        n.id === id ? { ...n, readAt: new Date().toISOString() } : n,
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.readAt).length,
      };
    });
  },

  markAllAsRead: () => {
    const now = new Date().toISOString();
    set((s) => ({
      notifications: s.notifications.map((n) => ({
        ...n,
        readAt: n.readAt || now,
      })),
      unreadCount: 0,
    }));
  },

  addNotification: (notification) => {
    const newNotif: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set((s) => ({
      notifications: [newNotif, ...s.notifications],
      unreadCount: s.unreadCount + 1,
    }));
  },

  deleteNotification: (id) => {
    set((s) => {
      const updated = s.notifications.filter((n) => n.id !== id);
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.readAt).length,
      };
    });
  },

  deleteAllRead: () => {
    set((s) => ({
      notifications: s.notifications.filter((n) => !n.readAt),
    }));
  },
}));

// Helper to batch init from seed data
export const initNotifications = (notifs: Notification[]) => {
  useNotificationStore.getState().setNotifications(notifs);
};
