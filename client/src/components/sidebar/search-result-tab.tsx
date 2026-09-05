import { useQueryClient } from "@tanstack/react-query";
import { useUI } from "../../providers/UIContext";
import type { ChatListItem, User } from "../../schema/types";

type Props = {
  user: User;
};

export default function SearchResultTab({ user }: Props) {
  const { activeChat, setActiveChat } = useUI();
  const { userId } = activeChat;
  const queryClient = useQueryClient();
  return (
    <div
      className={`${userId === user._id ? "bg-brand" : ""} border-b cursor-pointer p-2 rounded-md`}
      onClick={() => {
        // Find out if chat with this user exists in chats cache if yes then
        // then set chat id to what was found in cache
        const chats = queryClient.getQueryData<ChatListItem[]>(["chats"]);

        const chat = chats?.find((chat) => chat.otherUser?._id === user._id);

        const existingId = chat?.chatId ?? null;

        setActiveChat({
          userId: user._id,
          chatId: existingId,
        });
      }}
    >
      <div
        className="flex
       items-center gap-2"
      >
        {user.image ? (
          <img />
        ) : (
          <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
            <span className="font-semibold">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">
            {user.name ? user.name : user.username}
          </span>
          <span
            className={`text-xs ${userId === user._id ? "text-primary" : "text-muted-foreground"}`}
          >
            @{user.username}
          </span>
        </div>
      </div>
    </div>
  );
}
