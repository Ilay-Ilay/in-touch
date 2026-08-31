import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import protectRoute from "./middleware/protect-route";
import { connectDB } from "../db/db";

const PORT = process.env.PORT || 8888;

const app = express();

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api", protectRoute);

app.listen(PORT, () => {
  console.log("Server is now running on:", PORT);
});
