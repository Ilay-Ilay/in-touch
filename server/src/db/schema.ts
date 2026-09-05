import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    type: {
      type: String,

      enum: ["direct", "group"],

      required: true,
    },

    directKey: {
      type: String,

      unique: true,

      sparse: true,
    },
  },

  {
    timestamps: true,
  },
);

export const Chat = mongoose.model("Chat", chatSchema);

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Chat",

      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    content: {
      type: String,
    },

    attachments: {
      type: [String],
    },
  },

  {
    timestamps: true,
  },
);

export const Message = mongoose.model("Message", messageSchema);

const chatMemberSchema = new mongoose.Schema({
  lastRead: {
    type: Date,

    default: null,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "User",

    required: true,
  },

  chatId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "Chat",

    required: true,
  },
});
messageSchema.index({ chatId: 1, createdAt: 1 });

chatMemberSchema.index(
  { chatId: 1, userId: 1 },

  { unique: true },
);

export const ChatMember = mongoose.model("ChatMember", chatMemberSchema);
