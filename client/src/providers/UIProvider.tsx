import { useState } from "react";
import { UIContext } from "./UIContext";
import type { User } from "../schema/types";

type Props = {
  children: React.ReactNode;
};

export default function UIProvider({ children }: Props) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <UIContext.Provider
      value={{
        selectedUser,
        setSelectedUser,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}
