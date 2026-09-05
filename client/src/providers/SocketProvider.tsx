import { useEffect, useMemo } from "react";

import { io, type Socket } from "socket.io-client";
import { SocketContext } from "./SocketContext";
import { useQueryClient } from "@tanstack/react-query";
import type { MessageType } from "../features/chat/components/chat-feed";

type Props = {
  children: React.ReactNode;
};

type ChatData = {
  messages: MessageType[];
};

export function SocketProvider({ children }: Props) {
  const queryClient = useQueryClient();

  const socket = useMemo(
    () =>
      io(import.meta.env.VITE_API_URL, {
        withCredentials: true,
      }),
    [],
  );

  socket.on("message", (message: MessageType) => {
    queryClient.setQueryData<ChatData>(
      ["chat", message.chatId],

      (prev) => {
        if (!prev) return prev;

        return {
          ...prev,

          messages: [...prev.messages, message],
        };
      },
    );
  });

  socket.on("chatSeen", (chatId: string) => {
    queryClient.invalidateQueries({
      queryKey: ["chats"],
    });
  });

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
