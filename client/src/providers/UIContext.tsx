import { createContext, useContext } from "react";
import type { User } from "../schema/types";

// import type { Conversation } from "../schema/types";

type UIContext = {
  selectedUser: User | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;

  //   selectedConversation: Conversation | null;

  //   setSelectedConversation: React.Dispatch<
  //     React.SetStateAction<Conversation | null>
  //   >;
};

export const UIContext = createContext<UIContext | null>(null);

export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error("UI Context should be provided");
  return context;
}
