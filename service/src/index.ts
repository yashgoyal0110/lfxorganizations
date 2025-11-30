import express from "express";
import cors from 'cors';
import { router as orgsRouter } from "./router/orgs";
import { router as githubLoginRouter } from "./router/githubLogin";
import { router as flashcardRouter } from "./router/flashcard";
import { router as flashcardViewsRouter } from "./router/flashcardViews";
import cookieParser from "cookie-parser";
import { FRONTEND_URL, PORT } from './env';

const app = express();
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use("/api/v1", orgsRouter);
app.use("/api/v1", githubLoginRouter);
app.use("/api/v1/flashcards", flashcardRouter);
app.use("/api/v1/flashcard-views", flashcardViewsRouter);
app.get("/", async (req, res) => {
  res.json({ message: "Server is running" });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
