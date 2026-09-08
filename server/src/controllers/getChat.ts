import { Request, Response } from "express";

import mongoose from "mongoose";

import { Message } from "../db/schema";

export default async function ChatController(req: Request, res: Response) {
  try {
    const { chatId } = req.params;

    const { cursor } = req.query;

    if (typeof chatId !== "string") {
      return res.status(400).json({
        message: "chatId is required",
      });
    }

    if (!mongoose.isObjectIdOrHexString(chatId)) {
      return res.status(400).json({
        message: "Invalid chatId",
      });
    }

    const query: any = {
      chatId: new mongoose.Types.ObjectId(chatId),
    };

    if (typeof cursor === "string") {
      if (!mongoose.isObjectIdOrHexString(cursor)) {
        return res.status(400).json({
          message: "Invalid cursor",
        });
      }

      query._id = {
        $lt: new mongoose.Types.ObjectId(cursor),
      };
    }

    const messages = await Message.find(query)

      .sort({ createdAt: -1, _id: -1 })

      .limit(100);

    messages.reverse();

    const nextCursor = messages.length > 0 ? messages[0]._id.toString() : null;

    return res.status(200).json({
      messages,

      nextCursor,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error getting messages",
    });
  }
}
