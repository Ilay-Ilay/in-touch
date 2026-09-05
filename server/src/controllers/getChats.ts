import { Request, Response } from "express";
import { ChatMember } from "../db/schema";
import mongoose from "mongoose";

export default async function getChats(req: Request, res: Response) {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const chats = await ChatMember.aggregate([
      {
        $match: {
          userId,
        },
      },

      {
        $lookup: {
          from: "chats",
          localField: "chatId",
          foreignField: "_id",
          as: "chat",
        },
      },

      {
        $unwind: "$chat",
      },

      {
        $lookup: {
          from: "chatmembers",

          let: {
            chatId: "$chatId",

            currentUserId: "$userId",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$chatId", "$$chatId"] },

                    { $ne: ["$userId", "$$currentUserId"] },
                  ],
                },
              },
            },
          ],

          as: "otherMembers",
        },
      },

      {
        $lookup: {
          from: "user",

          localField: "otherMembers.userId",

          foreignField: "_id",

          as: "otherUsers",
        },
      },

      {
        $lookup: {
          from: "messages",
          let: {
            chatId: "$chatId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$chatId", "$$chatId"],
                },
              },
            },
            {
              $sort: {
                createdAt: -1,
              },
            },
            {
              $limit: 1,
            },
          ],
          as: "lastMessage",
        },
      },

      {
        $lookup: {
          from: "messages",
          let: {
            chatId: "$chatId",
            lastRead: "$lastRead",
            currentUserId: "$userId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$chatId", "$$chatId"],
                    },

                    {
                      $ne: ["$senderId", "$$currentUserId"],
                    },

                    {
                      $or: [
                        {
                          $eq: ["$$lastRead", null],
                        },
                        {
                          $gt: ["$createdAt", "$$lastRead"],
                        },
                      ],
                    },
                  ],
                },
              },
            },

            {
              $count: "count",
            },
          ],
          as: "unread",
        },
      },

      {
        $project: {
          _id: 0,
          chatId: 1,
          type: "$chat.type",
          lastRead: 1,
          otherUser: {
            $arrayElemAt: ["$otherUsers", 0],
          },
          lastMessage: {
            $arrayElemAt: ["$lastMessage", 0],
          },
          unreadCount: {
            $ifNull: [
              {
                $arrayElemAt: ["$unread.count", 0],
              },
              0,
            ],
          },
        },
      },

      {
        $sort: {
          "lastMessage.createdAt": -1,
        },
      },
    ]);

    return res.status(200).json(chats);
  } catch (error) {
    console.error("Failed to get chats:", error);

    return res.status(500).json({
      error: "Failed to get chats",
    });
  }
}
