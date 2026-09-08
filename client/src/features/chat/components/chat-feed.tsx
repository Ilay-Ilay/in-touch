import ChatInput from "./chat-input";
import FullScreenLoader from "#components/ui/fullscreen-loader";
import Message from "./message";
import formatMessageDate from "../utils/formatMessageDate";
import { useEffect, useLayoutEffect, useRef } from "react";
import useInfiniteLoad from "../hooks/useInfiniteLoad";
import sortPages from "../utils/sortPages";

export type MessageType = {
  _id: string;
  chatId: string;
  senderId: string;
  content: string;
  attachments?: string[];
  createdAt: string;
};

type Props = {};

export default function ChatFeed({}: Props) {
  // INFINITE LOAD FETCHING
  const {
    messages,

    fetchNextPage,

    hasNextPage,

    isFetchingNextPage,
    isLoading,
  } = useInfiniteLoad();

  //

  const containerRef = useRef<HTMLDivElement>(null);

  const previousScrollPositionRef = useRef<{
    scrollTop: number;

    scrollHeight: number;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop <= 10 && hasNextPage && !isFetchingNextPage) {
        previousScrollPositionRef.current = {
          scrollTop: container.scrollTop,

          scrollHeight: container.scrollHeight,
        };

        fetchNextPage();
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // INITIAL LOAD

  const initialLoad = useRef(true);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container || !messages.length) return;

    if (initialLoad.current) {
      // SCROLL TO THE END IF INITIAL LOAD AND SET INITIAL TO FALSE
      container.scrollTop = container.scrollHeight;

      initialLoad.current = false;

      return;
    }

    const previous = previousScrollPositionRef.current;

    if (!previous) return;

    const restoreScroll = () => {
      const heightAdded = container.scrollHeight - previous.scrollHeight;

      if (heightAdded > 0) {
        container.scrollTop = previous.scrollTop + heightAdded;

        previousScrollPositionRef.current = null;
      }
    };

    requestAnimationFrame(restoreScroll);
  }, [messages]);

  if (isLoading) return <FullScreenLoader />;
  // SORT MESSAGES BY CALENDAR DATE
  const sortedMessages: Record<string, MessageType[]> = sortPages(messages);

  return (
    <div className="h-screen relative flex flex-col">
      <div
        ref={containerRef}
        className="flex-1 min-h-0 overflow-y-auto p-8 pb-32"
      >
        {!messages ? (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            No messages here yet
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages && (
              <>
                {Object.keys(sortedMessages)
                  .sort()
                  .map((dateKey) => (
                    <div key={dateKey}>
                      <div className="text-center text-xs text-muted-foreground mb-2">
                        {formatMessageDate(new Date(dateKey))}
                      </div>

                      <div className="flex flex-col gap-2">
                        {sortedMessages[dateKey].map((message: MessageType) => (
                          <Message key={message._id} message={message} />
                        ))}
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        )}
      </div>
      <ChatInput />
    </div>
  );
}
