import type { Server } from "socket.io";
import { Chat, ChatMember, Message } from "../db/schema";
import getDirectKey from "../utils/getDirectKey";
import mongoose from "mongoose";
import { send } from "node:process";
import sendOnlineStatus from "../utils/sendOnlineStatus";

type OnlineSocket = Record<string, string>;

export const onlineUsers = new Set<string>();

export function initializeSocket(io: Server) {
  io.on("connection", (socket) => {
    socket.join(socket.userId);
    onlineUsers.add(socket.userId);
    sendOnlineStatus(socket);

    socket.on("chatSeen", async (data) => {
      try {
        if (!mongoose.isObjectIdOrHexString(data.chatId)) {
          return;
        }
        const chatId = new mongoose.Types.ObjectId(data.chatId);

        const userId = new mongoose.Types.ObjectId(socket.userId);

        await ChatMember.updateOne(
          { userId, chatId },

          { $set: { lastRead: new Date() } },
        );

        socket.emit("chatSeen", { chatId: data.chatId });
      } catch (error) {
        console.error("Error updating last read:", error);
      }
    });

    socket.on("sendMessage", async (data) => {
      const senderId = new mongoose.Types.ObjectId(socket.userId);

      const recipientId = new mongoose.Types.ObjectId(data.recipientId);
      try {
        const directKey = getDirectKey(socket.userId, data.recipientId);

        let chat = await Chat.findOne({ directKey });

        if (!chat) {
          // if no chat create one and member documents for both users
          chat = await Chat.create({
            type: "direct",

            directKey,
          });
          await ChatMember.create([
            {
              chatId: chat._id,

              userId: senderId,

              lastRead: new Date(),
            },

            {
              chatId: chat._id,

              userId: recipientId,

              lastRead: null,
            },
          ]);
        }

        const message = await Message.create({
          senderId,

          content: data.content,

          chatId: chat._id,
        });

        io.to(data.recipientId).emit("message", message);

        io.to(socket.userId).emit("message", message);
      } catch (error) {
        console.error("Failed to send message:", error);

        socket.emit("messageError", {
          message: "Failed to send message",
        });
      }
    });
    socket.on("disconnect", () => {
      onlineUsers.delete(socket.userId);
      console.log("Client disconnected:", socket.id);
    });
  });
}
