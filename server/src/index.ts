import "dotenv/config";
import express from "express";
import cors from "cors";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.ts";
import protectRoute from "./middleware/protect-route.ts";
import { connectDB } from "./db/db.ts";
import apiRouter from "./routes/api-router.ts";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import { initializeSocket } from "./socket/socket.ts";

export interface AuthenticatedSocket extends Socket {
  userId: string;
}

const PORT = process.env.PORT || 8888;

const app = express();
const httpServer = createServer(app);
await connectDB();

export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",

    credentials: true,
  },
});
// Verify user using better auth to acces web socket
io.use(async (socket, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(socket.handshake.headers),
    });

    if (!session) {
      return next(new Error("Unauthorized"));
    }

    socket.userId = session.user.id;

    next();
  } catch (error) {
    console.error("Socket auth error:", error);

    next(new Error("Unauthorized"));
  }
});

initializeSocket(io);

app.use(
  cors({
    origin: "http://localhost:5173",

    methods: ["GET", "POST", "PUT", "DELETE"],

    credentials: true,
  }),
);
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api", protectRoute, apiRouter);

httpServer.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
