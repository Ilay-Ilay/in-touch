import { fromNodeHeaders } from "better-auth/node";

import { NextFunction, Request, Response } from "express";

import type { IncomingHttpHeaders } from "node:http";

import { auth } from "../lib/auth";

export default async function protectRoute(
  req: Request,

  res: Response,

  next: NextFunction,
) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers as IncomingHttpHeaders),
  });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  (req as any).user = session.user;

  (req as any).session = session.session;

  next();
}
