import { useEffect, useMemo } from "react";

import { io } from "socket.io-client";
import { SocketContext } from "./SocketContext";
import { useQueryClient } from "@tanstack/react-query";
import type { MessageType } from "../features/chat/components/chat-feed";
import { useUI } from "./UIContext";

type Props = {
  children: React.ReactNode;
};

export type Page = {
  messages: MessageType[];
  nextCursor: string;
};

export type ChatPages = {
  pages: Page[];
  pageParams?: [];
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
      queryClient.setQueryData<ChatPages | undefined>(
        ["chat", message.chatId],
        (prev) => {
          console.log(prev);
          if (!prev) return;
          return {
            ...prev,
            pages: prev.pages.map((page: Page, index) => {
              return index === prev.pages.length - 1
                ? { ...page, messages: [...page.messages, message] }
                : page;
            }),
          };
        },
      );
      //   Immediately mark chat as seen if the user is looking at the specific
      //  chat where the message was recieved
      if (chatId === message.chatId) {
        socket.emit("chatSeen", { chatId: message.chatId });
        queryClient.setQueryData(["chats"], (prev) => {
          if (!prev) return prev;

          return prev.map((chat) =>
            chat.chatId === chatId ? { ...chat, unreadCount: 0 } : chat,
          );
        });
      }
    }

    // Ivalidate chats on the client if it was seen
    // function handleChatSeen() {
    //   queryClient.invalidateQueries({
    //     queryKey: ["chats"],
    //   });
    // }

    function handleUserStatus({
      userId,
      isOnline,
    }: {
      userId: string;
      isOnline: boolean;
    }) {
      queryClient.setQueryData(["chats"], (prev: any[] | undefined) => {
        if (!prev) return;

        return prev.map((chat) =>
          chat.otherUser._id === userId
            ? {
                ...chat,

                otherUser: {
                  ...chat.otherUser,

                  isOnline,
                },
              }
            : chat,
        );
      });
    }

    socket.on("message", handleMessage);
    // socket.on("chatSeen", handleChatSeen);
    socket.on("userIsOnline", handleUserStatus);
    socket.on("userIsOffline", handleUserStatus);

    return () => {
      socket.off("userIsOffline", handleUserStatus);
      socket.off("message", handleMessage);

      //   socket.off("chatSeen", handleChatSeen);

      socket.off("userIsOnline", handleUserStatus);
    };
  }, [socket, chatId, queryClient]);

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
