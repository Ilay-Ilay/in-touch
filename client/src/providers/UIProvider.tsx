import { useState } from "react";
import { UIContext, type ActiveChat } from "./UIContext";

type Props = {
  children: React.ReactNode;
};

export default function UIProvider({ children }: Props) {
  const [activeChat, setActiveChat] = useState<ActiveChat>({
    userId: null,
    chatId: null,
  });
  return (
    <UIContext.Provider
      value={{
        activeChat,
        setActiveChat,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}
