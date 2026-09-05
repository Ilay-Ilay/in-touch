import { useUI } from "../../../providers/UIContext";
import ChatInput from "./chat-input";
import useActiveChat from "../hooks/useActiveChat";
import FullScreenLoader from "#components/ui/fullscreen-loader";
import { authClient } from "#lib/auth";
import Message from "./message";
import formatMessageDate from "../utils/formatMessageDate";
import useSocket from "../../../providers/SocketContext";
import { useEffect } from "react";

export type MessageType = {
  _id: string;
  chatId: string;
  senderId: string;
  content: string;
  attachments?: string[];
  createdAt: string;
};

type Props = {};

export default function ChatFeed({}: Props) {
  const { activeChat } = useUI();
  const { chatId, userId } = activeChat;
  const { data: chatData, isLoading, error } = useActiveChat();

  const socket = useSocket();

  const { data: session, isPending } = authClient.useSession();
  const sessionId = session?.user?.id;

  console.log("ChatFeed render:", chatId);
  // Mark chatSeen when chat id changes or new messages update the cache
  useEffect(() => {
    if (!chatId) return;

    socket.emit("chatSeen", chatId);
  }, [chatId, chatData?.messages.length]);

  if (isLoading || isPending) return <FullScreenLoader />;

  // If chat feed changes mark messages as read and emit a message

  // sort messages by calendar date
  const sortedMessages: Record<string, MessageType[]> = {};

  chatData.messages.forEach((message: MessageType) => {
    const date = new Date(message.createdAt);

    // ISO FORMAT so I can transform that into Date object later
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate(),
    ).padStart(2, "0")}`;

    if (!sortedMessages[dateKey]) {
      sortedMessages[dateKey] = [message];
    } else {
      sortedMessages[dateKey].push(message);
    }
  });

  return (
    <div className="h-screen relative flex flex-col">
      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-8 pb-32">
        {!chatId ? (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            No messages here yet
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {chatData &&
              session &&
              Object.keys(sortedMessages).map((dateKey) => (
                <div key={dateKey}>
                  <div className="text-center text-xs text-muted-foreground mb-2">
                    {formatMessageDate(new Date(dateKey))}
                  </div>

                  <div className="flex flex-col gap-2">
                    {sortedMessages[dateKey].map((message: MessageType) => (
                      <div
                        key={message._id}
                        className={`flex ${
                          sessionId === message.senderId
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <Message
                          message={message}
                          isMyMessage={sessionId === message.senderId}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput />
    </div>
  );
}
