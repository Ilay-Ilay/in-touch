import { useNavigate } from "react-router";
import formatDate from "../../features/chat/utils/formatDate";
import formatTime from "../../features/chat/utils/formatTime";
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
    isOnline?: boolean | null;
  };
};

type Props = {
  chat: ChatData;
};

export default function ChatTab({ chat }: Props) {
  const { activeChat, setActiveChat } = useUI();
  const navigate = useNavigate();
  const { userId, chatId } = activeChat;

  if (!chat.otherUser || !chat.lastMessage) return null;
  const { _id, username, image, name } = chat.otherUser;
  const { content, createdAt } = chat.lastMessage;

  const createdDate = new Date(createdAt);

  const isToday = isTodaysDate(createdDate);

  return (
    <div
      className={`${userId === _id ? "bg-brand-dark rounded-md" : "border-b"} cursor-pointer p-2`}
      onClick={() => {
        navigate("/chat", {
          replace: true,
        });
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
        <div className="relative">
          {chat.otherUser.isOnline && (
            <div className="h-4 w-4 rounded-full bg-green-700 border-sidebar border-3 absolute top-0 right-0" />
          )}
          {chat.otherUser.image ? (
            <img />
          ) : (
            <div className="h-12 w-12 rounded-full bg-brand flex items-center justify-center">
              <span className="font-semibold">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {name ? shortenString(name) : shortenString(username)}
            </span>

            <span className={`text-xs text-muted-foreground`}>
              {isToday
                ? `${formatTime(createdDate)}`
                : `${formatDate(createdDate)}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={`text-xs text-muted-foreground`}>
              {shortenString(content)}
            </span>

            {chat.unreadCount > 0 && (
              <div className="flex items-center justify-center bg-primary h-4 w-4 rounded-full text-background font-medium text-center">
                <span className="text-xs font-semibold">
                  {" "}
                  {chat.unreadCount}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
