import { AuthenticatedSocket } from "..";

import { ChatMember } from "../db/schema";

export default async function sendOnlineStatus(socket: AuthenticatedSocket) {
  const memberships = await ChatMember.find({
    userId: socket.userId,
  });

  const chatIds = memberships.map((member) => member.chatId);

  const members = await ChatMember.find({
    chatId: { $in: chatIds },

    userId: { $ne: socket.userId },
  });

  const userIds = new Set(members.map((member) => String(member.userId)));

  userIds.forEach((userId) => {
    console.log("sending message to, ", userId);

    socket
      .to(userId)
      .emit("userIsOnline", { userId: socket.userId, isOnline: true });
  });
}
