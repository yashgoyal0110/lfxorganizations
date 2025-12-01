import { Request, Response } from "express";
import { db } from "../db";
import { flashCardViews } from "../db/schema";

export const markFlashcardViewed = async (req: Request, res: Response) => {
  try {
    const user : any = req.user;
    const { flashcardId } = req.body;
    console.log("User in markFlashcardViewed:", user);

    if (!user)
      return res.status(401).json({ message: "Unauthorized" });

    if (!flashcardId)
      return res.status(400).json({ message: "flashcardId is required" });

    // Check if already viewed
    const existing = await db.query.flashCardViews.findFirst({
      where: (fv, { eq, and }) =>
        and(eq(fv.userId, user.userId), eq(fv.flashcardId, flashcardId)),
    });
    if (existing)
      return res.json({ message: "Already viewed" });
    await db.insert(flashCardViews).values({
      userId: user.userId,
      flashcardId,
      viewedAt: new Date(),
    });

    res.json({ message: "Marked as viewed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error marking viewed" });
  }
};
