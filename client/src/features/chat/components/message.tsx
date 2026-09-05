import formatTime from "../utils/formatTime";
import type { MessageType } from "./chat-feed";

type Props = {
  message: MessageType;
  isMyMessage: boolean;
};

export default function Message({ message, isMyMessage }: Props) {
  const createdAt = new Date(message.createdAt);

  return (
    <div
      className={`w-fit sm:max-w-[70%] p-2 rounded-xl text-sm ${
        isMyMessage
          ? "bg-brand rounded-br-none"
          : "bg-secondary rounded-bl-none"
      }`}
    >
      <span className="wrap-break-words">{message.content}</span>

      <span className="ml-2 whitespace-nowrap text-xs text-muted-foreground">
        {formatTime(createdAt)}
      </span>
    </div>
  );
}
