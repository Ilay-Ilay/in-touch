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
