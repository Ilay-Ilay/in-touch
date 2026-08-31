import { Request, Response } from "express";
import { db } from "../lib/auth";

export default async function searchUsers(req: Request, res: Response) {
  try {
    const username = req.query.q;
    const users = await db
      .collection("user")
      .find({
        username: {
          $regex: username,

          $options: "i",
        },
      })
      .project({
        name: 1,

        username: 1,

        displayUsername: 1,
      })
      .limit(20)
      .toArray();

    res.status(200).json({ users });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Internal server error" });
  }
}
