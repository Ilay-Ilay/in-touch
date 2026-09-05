import { createContext, useContext } from "react";

export type ActiveChat = {
  userId: string | null;
  chatId: string | null;
};

type UIContext = {
  activeChat: ActiveChat;
  setActiveChat: React.Dispatch<React.SetStateAction<ActiveChat>>;
};

export const UIContext = createContext<UIContext | null>(null);

export function useUI() {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }

  return context;
}
