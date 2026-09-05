import { Request, Response } from "express";

import mongoose from "mongoose";

import { Message } from "../db/schema";

export default async function ChatController(req: Request, res: Response) {
  try {
    const chatId = req.query.chatId;

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

    const messages = await Message.find({
      chatId: new mongoose.Types.ObjectId(chatId),
    })

      .sort({ createdAt: -1, _id: -1 })

      .limit(20);

    messages.reverse();

    return res.status(200).json({
      messages,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error getting messages",
    });
  }
}
