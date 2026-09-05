import { Button } from "#components/ui/button";
import { Send } from "lucide-react";
import { useContext, useState } from "react";
import { useUI } from "../../../providers/UIContext";
import useSocket from "../../../providers/SocketContext";

type Props = {};

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const socket = useSocket();

  const { activeChat } = useUI();
  const { chatId, userId } = activeChat;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!message.trim()) return;

    socket.emit("sendMessage", {
      recipientId: userId,
      chatId,
      content: message.trim(),
    });

    setMessage("");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
      className="bg-background absolute bottom-8 left-8 right-8 rounded-full border border-border p-2 pl-4 flex  items-center justify-between gap-4"
    >
      <input
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        className="w-full outline-none text-sm"
        type="text"
        placeholder="Write a message..."
      />
      <Button
        type="submit"
        disabled={message.length === 0}
        size={"icon-lg"}
        className={`${message.length > 0 ? "bg-brand text-forgeround hover:bg-brand" : " bg-secondary text-muted-foreground"} rounded-full h-12 w-12`}
      >
        <Send strokeWidth={3} />
      </Button>
    </form>
  );
}
