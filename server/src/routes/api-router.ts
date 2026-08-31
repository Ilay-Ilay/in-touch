import express from "express";
import searchUsers from "../controllers/searchUsers.ts";

const router = express.Router();

router.get("/search/users", searchUsers);

export default router;
