export type NotificationType =
  | "MESSAGE"
  | "ATTENDANCE"
  | "GRADE"
  | "SYSTEM"
  | "SAFEGUARDING"
  | "ANNOUNCEMENT"
  | "ASSIGNMENT"
  | "INCIDENT";
export type AnnouncementPriority = "NORMAL" | "HIGH" | "URGENT";
export type AnnouncementStatus = "PUBLISHED" | "DRAFT" | "EXPIRED";

export interface Message {
  id: string;
  organisationId: string;
  fromUserId: string;
  toUserId: string;
  subject: string;
  body: string;
  attachmentNames: string[];
  readAt?: string;
  parentMessageId?: string;
  isDraft: boolean;
  createdAt: string;
}

export interface Announcement {
  id: string;
  organisationId: string;
  title: string;
  body: string;
  priority: AnnouncementPriority;
  authorId: string;
  audiences: string[];
  yearGroupIds: string[];
  classIds: string[];
  isPinned: boolean;
  expiryDate?: string;
  viewCount: number;
  status: AnnouncementStatus;
  sendPushNotification: boolean;
  attachmentNames: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  organisationId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  readAt?: string;
  createdAt: string;
}
