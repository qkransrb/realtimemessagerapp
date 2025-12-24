import { create } from "zustand";
import { toast } from "sonner";

import { API } from "@/lib/axios-client";
import type { UserType } from "@/types/auth.type";
import type { ChatType, CreateChatType, MessageType } from "@/types/chat.type";

interface ChatState {
  chats: ChatType[];
  users: UserType[];
  singleChat: {
    chat: ChatType;
    messages: MessageType[];
  } | null;

  isChatsLoading: boolean;
  isUsersLoading: boolean;
  isCreatingChat: boolean;
  isSingleChatLoading: boolean;

  fetchAllUsers: () => void;
  fetchChats: () => void;
  createChat: (payload: CreateChatType) => Promise<ChatType | null>;
  fetchSingleChat: (chatId: string) => void;
  addNewChat: (newChat: ChatType) => void;
}

export const useChat = create<ChatState>()((set, get) => ({
  chats: [],
  users: [],
  singleChat: null,

  isChatsLoading: false,
  isUsersLoading: false,
  isCreatingChat: false,
  isSingleChatLoading: false,

  fetchSingleChat: async () => {
    set({ isSingleChatLoading: true });
  },
  fetchAllUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const { data } = await API.get("/user/all");
      set({ users: data.users });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  fetchChats: async () => {
    set({ isChatsLoading: true });
    try {
      const { data } = await API.get("/chat/all");
      set({ chats: data.chats });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch chats");
    } finally {
      set({ isChatsLoading: false });
    }
  },
  createChat: async (payload: CreateChatType) => {
    set({ isCreatingChat: true });
    try {
      const { data } = await API.post("/chat/create", payload);
      get().addNewChat(data.chat);
      return data.chat;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create chat");
      return null;
    } finally {
      set({ isCreatingChat: false });
    }
  },
  addNewChat: async (newChat: ChatType) => {
    set((state) => {
      const existingChatIndex = state.chats.findIndex(
        (chat) => chat._id === newChat._id
      );
      if (existingChatIndex !== -1) {
        // move the chat to the top
        return {
          chats: [
            newChat,
            ...state.chats.filter((chat) => chat._id !== newChat._id),
          ],
        };
      } else {
        return {
          chats: [newChat, ...state.chats],
        };
      }
    });
  },
}));
