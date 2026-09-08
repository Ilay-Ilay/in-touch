import { useInfiniteQuery } from "@tanstack/react-query";

import { useUI } from "../../../providers/UIContext";

import getChatMessages from "../utils/getChatMessages";

export default function useInfiniteLoad() {
  const { activeChat } = useUI();

  const { chatId } = activeChat;

  const query = useInfiniteQuery({
    queryKey: ["chat", chatId],

    queryFn: ({ pageParam }) => getChatMessages(chatId, pageParam),

    initialPageParam: null,

    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const messages =
    query.data?.pages
      .flatMap((page) => page.messages)
      .sort((a, b) => a.createdAt - b.createdAt) ?? [];

  return {
    ...query,

    messages,
  };
}
