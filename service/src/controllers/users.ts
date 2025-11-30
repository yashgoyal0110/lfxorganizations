import { db } from "../db";
import { users } from "../db/schema";
import { eq, or } from "drizzle-orm";

export const findUserByEmailOrUserName = async (email: string, userName: string) => {
    try{
    const existing = await db.query.users.findFirst({
      where: or(
        eq(users.email, email),
        eq(users.userName, userName)
      ),
    });
    
    if (existing) {
      existing.lastLoggedAt = new Date();
      await db.update(users).set({ lastLoggedAt: existing.lastLoggedAt }).where(eq(users.id, existing.id));
      return existing;
    }
    return false
} catch (err) {
    console.error("Error finding user:", err);
    throw err;
  }
}

export const addUser = async (name: string, userName: string, email: string) => {
    try {
        const newUser = await db.insert(users).values({
            name,
            userName,
            email,
            lastLoggedAt : new Date()
        }).returning();
        console.log("Added new user:", newUser);

        return newUser;
    } catch (err) {
        console.error("Error adding user:", err);
        throw err;
    }
}