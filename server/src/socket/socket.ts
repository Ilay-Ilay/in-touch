import type { Server } from "socket.io";
import { Chat, ChatMember, Message } from "../db/schema";
import getDirectKey from "../utils/getDirectKey";
import mongoose from "mongoose";

export function initializeSocket(io: Server) {
  io.on("connection", (socket) => {
    socket.join(socket.userId);

    socket.on("chatSeen", async (data) => {
      try {
        if (!mongoose.isObjectIdOrHexString(data.chatId)) {
          return;
        }
        console.log("CHAT WAS SEEN BY THE USER");
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
      console.log("Client disconnected:", socket.id);
    });
  });
}
