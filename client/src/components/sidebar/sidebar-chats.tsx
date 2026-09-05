import FullScreenLoader from "#components/ui/fullscreen-loader";
import useChats from "../../features/chat/hooks/useChats";
import ChatTab from "./chat-tab";

type Props = {};

export default function SidebarChats({}: Props) {
  const { isLoading, data: chats, error } = useChats();

  return (
    <div>
      {isLoading && <FullScreenLoader />}
      {chats &&
        chats.length > 0 &&
        chats.map((chat) => <ChatTab chat={chat} key={chat.chatId} />)}
    </div>
  );
}
