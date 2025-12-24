import type { UserType } from "./auth.type";

export type MessageType = {
  _id: string;
  content: string | null;
  image: string | null;
  sender: UserType | null;
  replyTo: MessageType | null;
  chatId: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
};

export type ChatType = {
  _id: string;
  lastMessage: MessageType;
  participants: UserType[];
  isGroup: boolean;
  groupName?: string;
  createdBy: string;
  creatdAt: string;
  updatedAt: string;
};

export type CreateChatType = {
  participantId?: string;
  isGroup?: boolean;
  participants?: string[];
  groupName?: string;
};

export type CreateMessageType = {
  chatId: string;
  content?: string;
  image?: string;
  replyTo?: MessageType | null;
};
