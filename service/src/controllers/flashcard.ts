import { Request, Response } from "express";
import { db } from "../db";
import { flashcards } from "../db/schema";

export const bulkInsertFlashcards = async (req: Request, res: Response) => {
  try {
    const { cards } = req.body;

    if (!Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({ message: "cards array required" });
    }

    await db.insert(flashcards).values(cards);

    res.json({ message: "Flashcards inserted successfully", count: cards.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error inserting flashcards" });
  }
};

export const getTodaysFlashcard = async (req: Request, res: Response) => {
  try {
    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const startOfTomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );

    const isAlreadyViewed = await db.query.flashCardViews.findFirst({
      where: (fv, { and, eq, gte, lt }) =>
        and(
          eq(fv.userId, req.user.userId),
          gte(fv.viewedAt, startOfToday),
          lt(fv.viewedAt, startOfTomorrow),
        ),
    });

    if (isAlreadyViewed) {
      return res.json({ message: "Flashcard already viewed today" });
    }

    // For the flashcard itself:
    // If `availableOn` is a DATE column, keep the YYYY-MM-DD string.
    const todayDate = new Date().toISOString().split("T")[0];

    const card = await db.query.flashcards.findFirst({
      where: (fc, { eq }) => eq(fc.availableOn, todayDate),
    });

    if (!card) {
      return res.json({ message: "No flashcard for today" });
    }

    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching flashcard" });
  }
};


