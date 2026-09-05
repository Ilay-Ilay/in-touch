import isTodaysDate from "../../features/chat/utils/isTodaysDate";
import shortenString from "../../features/chat/utils/shortenString";
import { useUI } from "../../providers/UIContext";

type ChatData = {
  chatId: string;

  lacontentead: Date | null;

  type: "direct" | "group";

  unreadCount: number;

  lastMessage: {
    content: string;
    createdAt: Date;
  };

  otherUser: {
    _id: string;
    name: string;
    image: string | null;
    username: string;
  };
};

type Props = {
  chat: ChatData;
};

export default function ChatTab({ chat }: Props) {
  const { activeChat, setActiveChat } = useUI();

  const { userId, chatId } = activeChat;

  if (!chat.otherUser) return null;
  const { _id, username, image, name } = chat.otherUser;
  const { content, createdAt } = chat.lastMessage;

  const createdDate = new Date(createdAt);

  const isToday = isTodaysDate(createdDate);

  return (
    <div
      className={`${userId === _id ? "bg-brand rounded-md" : "border-b"} cursor-pointer p-2`}
      onClick={() => {
        setActiveChat({
          chatId: chat.chatId,
          userId: _id,
        });
      }}
    >
      <div
        className="flex
         items-center gap-2"
      >
        {chat.otherUser.image ? (
          <img />
        ) : (
          <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
            <span className="font-semibold">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {name ? shortenString(name) : shortenString(username)}
            </span>

            <span
              className={`text-xs ${userId === _id ? "text-primary" : "text-muted-foreground"}`}
            >
              {isToday
                ? `${createdDate.getHours()}:${createdDate.getMinutes()}`
                : `${111} Ashaleeet`}
            </span>
          </div>
          <div className="flex justify-between">
            <span
              className={`text-xs ${userId === _id ? "text-primary" : "text-muted-foreground"}`}
            >
              {shortenString(content)}
            </span>
            <div className="flex items-center justify-center bg-primary h-4 w-4 rounded-full text-background font-medium text-center">
              <span className="text-xs font-semibold"> {chat.unreadCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
