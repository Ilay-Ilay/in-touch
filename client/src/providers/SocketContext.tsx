import { createContext, useContext } from "react";
import type { Socket } from "socket.io-client";

export const SocketContext = createContext<Socket | null>(null);

export default function useSocket() {
  const context = useContext(SocketContext);
  if (!context) throw new Error("Socket context should be provided");
  return context;
}
