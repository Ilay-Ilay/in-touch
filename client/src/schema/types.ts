export type Conversation = {
  directKey: String;
  type: String;
};

export type User = {
  _id: string;

  username: string;

  name: string;

  image: string | null;
};

export type ChatListItem = {
  chatId: string;

  type: "direct" | "group";

  lastRead: Date | null;

  otherUser: {
    _id: string;

    name?: string;

    username?: string;

    email: string;

    image?: string | null;
  } | null;

  lastMessage: {
    _id: string;

    chatId: string;

    senderId: string;

    content: string;

    createdAt: Date;
  } | null;

  unreadCount: number;
};
