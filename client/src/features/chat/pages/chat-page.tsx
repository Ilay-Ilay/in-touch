import { useUI } from "../../../providers/UIContext";

export default function Chat({}) {
  const { selectedUser } = useUI();
  return (
    <main className="min-h-screen">
      {!selectedUser && (
        <div className="flex w-full h-full items-center justify-center">
          <span className="text-muted-foreground text-sm">
            Select a chat to start messaging
          </span>
        </div>
      )}
    </main>
  );
}
