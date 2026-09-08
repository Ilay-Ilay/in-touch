import { authClient } from "#lib/auth";
import formatTime from "../utils/formatTime";
import type { MessageType } from "./chat-feed";

type Props = {
  message: MessageType;
};

export default function Message({ message }: Props) {
  const { data: session } = authClient.useSession();
  const createdAt = new Date(message.createdAt);
  const sessionId = session?.user?.id;

  return (
    <div
      key={message._id}
      className={`flex ${
        sessionId === message.senderId ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`w-fit sm:max-w-[70%] p-2 rounded-xl text-xs ${
          sessionId === message.senderId
            ? "bg-brand-dark rounded-br-none"
            : "bg-secondary rounded-bl-none"
        }`}
      >
        <span className="wrap-break-words">{message.content}</span>

        <span className="ml-2 whitespace-nowrap text-xs text-muted-foreground">
          {formatTime(createdAt)}
        </span>
      </div>
    </div>
  );
}
