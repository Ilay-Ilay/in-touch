import { useQuery } from "@tanstack/react-query";

import { useUI } from "../../../providers/UIContext";

import getActiveChat from "../utils/getActiveChat";

export default function useActiveChat() {
  const { activeChat } = useUI();

  const { chatId } = activeChat;

  return useQuery({
    queryKey: ["chat", chatId],

    queryFn: () => getActiveChat(chatId!),

    enabled: !!chatId,

    staleTime: 5 * 60 * 1000,
  });
}
