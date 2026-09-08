import type { MessageType } from "../components/chat-feed";

export default function sortMessages(messages: MessageType[]) {
  const sortedMessages: Record<string, MessageType[]> = {};

  const sorted = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  sorted.forEach((message) => {
    const date = new Date(message.createdAt);

    const dateKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    if (!sortedMessages[dateKey]) {
      sortedMessages[dateKey] = [];
    }

    sortedMessages[dateKey].push(message);
  });

  return sortedMessages;
}
