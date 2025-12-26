import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import { requireAuth } from "./middlewares/auth.js";
import { prisma } from "./lib/prisma.js";
import friendsRouter from "./routes/friends.js";
import groupsRouter from "./routes/groups.js";
import schedulesRouter from "./routes/schedules.js";
import groupTimetableRouter from "./routes/groupTimetable.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Auth 라우터 연결
app.use("/auth", authRouter);

// Friend 라우터 연결
app.use("/friends", friendsRouter);

app.use("/groups", groupsRouter);

app.use("/me/schedules", schedulesRouter);

app.use(groupTimetableRouter);

// health 체크
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// me 테스트
app.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  return res.json({ user });
});


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
