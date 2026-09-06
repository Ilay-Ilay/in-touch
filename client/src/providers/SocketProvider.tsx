import { useEffect, useMemo } from "react";

import { io } from "socket.io-client";
import { SocketContext } from "./SocketContext";
import { useQueryClient } from "@tanstack/react-query";
import type { MessageType } from "../features/chat/components/chat-feed";
import { useUI } from "./UIContext";

type Props = {
  children: React.ReactNode;
};

type ChatData = {
  messages: MessageType[];
};

export function SocketProvider({ children }: Props) {
  const queryClient = useQueryClient();
  const { activeChat } = useUI();
  const { chatId } = activeChat;

  const socket = useMemo(
    () =>
      io(import.meta.env.VITE_API_URL, {
        withCredentials: true,
      }),
    [],
  );

  useEffect(() => {
    function handleMessage(message: MessageType) {
      queryClient.setQueryData<ChatData>(["chat", message.chatId], (prev) => {
        if (!prev) return prev;
        // If recieved message is from selected chat then mark as seen

        return {
          ...prev,
          messages: [...prev.messages, message],
        };
      });
      if (chatId === message.chatId) {
        socket.emit("chatSeen", { chatId: message.chatId });
        queryClient.setQueryData(["chats"], (prev: any[] | undefined) => {
          if (!prev) return prev;

          return prev.map((chat) =>
            chat.chatId === chatId ? { ...chat, unreadCount: 0 } : chat,
          );
        });
      }
    }

    function handleChatSeen(seenChatId: string) {
      queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
    }

    socket.on("message", handleMessage);
    socket.on("chatSeen", handleChatSeen);

    return () => {
      socket.off("message", handleMessage);
      socket.off("chatSeen", handleChatSeen);
    };
  }, [socket, chatId]);

  //   On chat select mark a chat as seen and emit a chatSeen event
  useEffect(() => {
    if (!chatId) return;

    socket.emit("chatSeen", { chatId });

    queryClient.setQueryData(["chats"], (prev: any[] | undefined) => {
      if (!prev) return prev;

      return prev.map((chat) =>
        chat.chatId === chatId ? { ...chat, unreadCount: 0 } : chat,
      );
    });
  }, [chatId, socket]);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
