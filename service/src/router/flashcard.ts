import { Router } from "express";
import { bulkInsertFlashcards, getTodaysFlashcard } from "../controllers/flashcard";
import { authMiddleware } from '../middlewares/auth';

export const router = Router();

// router.post("/bulk-insert", authMiddleware, bulkInsertFlashcards);
router.get("/today", authMiddleware, getTodaysFlashcard);


