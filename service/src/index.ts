import express from "express";
import cors from 'cors';
import { router as orgsRouter } from "./router/orgs";


const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use("/api/v1", orgsRouter);
app.get("/", async (req, res) => {
  res.json({ message: "Welcome to the Home Page" });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
