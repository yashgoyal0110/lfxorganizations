import { Router } from "express";
import { markFlashcardViewed } from "../controllers/flashcardViews";
import { authMiddleware } from "../middlewares/auth";

export const router = Router();

router.post("/view", authMiddleware, markFlashcardViewed);
