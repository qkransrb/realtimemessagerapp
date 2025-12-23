import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

import { Env } from "../config/env.config";
import { validateChatParticipant } from "../services/chat.service";

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

let io: Server | null = null;

const onlineUsers = new Map<string, string>();

export const initializeSocket = (httpServer: HTTPServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: Env.FRONTEND_ORIGIN,
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie;

      if (!rawCookie) {
        return next(new Error("Unauthorized"));
      }

      const token = rawCookie?.split("accessToken=")?.[1]?.trim();

      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const decodedToken = jwt.verify(token, Env.JWT_SECRET) as {
        userId: string;
      };

      if (!decodedToken) {
        return next(new Error("Unauthorized"));
      }

      socket.userId = decodedToken.userId;
      next();
    } catch (error) {
      next(new Error("Internal Server Error"));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;
    const newSocketId = socket.id;

    if (!socket.userId) {
      socket.disconnect(true);
      return;
    }

    console.log("socket connected", { userId, newSocketId });

    // register socket for the user
    onlineUsers.set(userId, newSocketId);

    // broadcast online users to all socket
    io?.emit("online:users", Array.from(onlineUsers.keys()));

    // create personal room for user
    socket.join(`user:${userId}`);

    socket.on(
      "chat:join",
      async (chatId: string, callback?: (err?: string) => void) => {
        try {
          await validateChatParticipant(chatId, userId);
          socket.join(`chat:${chatId}`);
          callback?.();
        } catch (error) {
          callback?.("Error joining chat");
        }
      }
    );

    socket.on("chat:leave", (chatId: string) => {
      if (chatId) {
        socket.leave(`chat:${chatId}`);
        console.log(`User ${userId} left room chat:${chatId}`);
      }
    });

    socket.on("disconnect", () => {
      if (onlineUsers.get(userId) === newSocketId) {
        if (userId) {
          onlineUsers.delete(userId);
        }

        io?.emit("online:user", Array.from(onlineUsers.keys()));

        console.log("socket disconnected", {
          userId,
          newSocketId,
        });
      }
    });
  });
};

function getIO() {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }

  return io;
}

export const emitNewChatToParticipants = (
  participantIds: string[] = [],
  chat: any
) => {
  const io = getIO();

  for (const participantId of participantIds) {
    io.to(`user:${participantId}`).emit("chat:new", chat);
  }
};

export const emitNewMessageToChatRoom = (
  senderId: string,
  chatId: string,
  message: any
) => {
  const io = getIO();
  const senderSocketId = onlineUsers.get(senderId);

  if (senderSocketId) {
    io.to(`chat:${chatId}`).except(senderSocketId).emit("message:new", message);
  } else {
    io.to(`chat:${chatId}`).emit("message:new", message);
  }
};

export const emitLastMessageToParticipants = (
  allParticipantIds: string[],
  chatId: string,
  lastMessage: any
) => {
  const io = getIO();
  const payload = { chatId, lastMessage };

  for (const participantId of allParticipantIds) {
    io.to(`user:${participantId}`).emit("chat:update", payload);
  }
};
