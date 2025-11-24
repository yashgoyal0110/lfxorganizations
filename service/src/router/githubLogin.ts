import { Router } from "express";
import { getMe, githubLogin, logOut } from "../controllers/GithubLogin";
export const router = Router();

router.get("/auth/github/callback", githubLogin);
router.get("/me", getMe);
router.post("/logout", logOut);