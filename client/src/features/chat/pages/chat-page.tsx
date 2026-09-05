import ChatFeed from "../components/chat-feed";
import { useUI } from "../../../providers/UIContext";

export default function Chat({}) {
  const { activeChat } = useUI();

  return (
    <main className="min-h-screen">
      {!activeChat.userId && (
        <div className="flex w-full h-full items-center justify-center">
          <span className="text-muted-foreground text-sm">
            Select a chat to start messaging
          </span>
        </div>
      )}
      {activeChat.userId && <ChatFeed />}
    </main>
  );
}
