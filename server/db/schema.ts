import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
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
});

export const Conversation = mongoose.model("Conversation", conversationSchema);

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Conversation",

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

const conversationMemberSchema = new mongoose.Schema({
  lastRead: {
    type: Date,

    default: null,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "User",

    required: true,
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "Conversation",

    required: true,
  },
});

messageSchema.index({ conversationId: 1, createdAt: 1 });

conversationMemberSchema.index(
  { conversationId: 1, userId: 1 },

  { unique: true },
);

export const ConversationMember = mongoose.model(
  "ConversationMember",
  conversationMemberSchema,
);
