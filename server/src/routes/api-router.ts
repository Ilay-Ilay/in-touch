import express from "express";
import searchUsers from "../controllers/searchUsers.ts";
import getChats from "../controllers/getChats.ts";
import ChatController from "../controllers/getChat.ts";

const router = express.Router();

router.get("/search/users", searchUsers);

router.get("/chats", getChats);

router.get("/chat", ChatController);

export default router;
