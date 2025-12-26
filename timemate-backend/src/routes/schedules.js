import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

/**
 * 개인 시간표 추가
 */
router.post("/", requireAuth, async (req, res) => {
  const schema = z.object({
    subject: z.string().min(1),
    professor: z.string().min(1),
    classroom: z.string().min(1),
    day: z.enum(["MON","TUE","WED","THU","FRI","SAT","SUN"]),
    startHour: z.number().int().min(0).max(23),
    endHour: z.number().int().min(1).max(24),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid body" });
  }

  const { startHour, endHour } = parsed.data;
  if (endHour <= startHour) {
    return res.status(400).json({ message: "endHour must be after startHour" });
  }

  const schedule = await prisma.personalSchedule.create({
    data: {
      ...parsed.data,
      userId: req.userId,
    },
  });

  res.status(201).json({ schedule });
});

/**
 * 내 시간표 조회
 */
router.get("/", requireAuth, async (req, res) => {
  const schedules = await prisma.personalSchedule.findMany({
    where: { userId: req.userId },
    orderBy: [{ day: "asc" }, { startHour: "asc" }],
  });

  res.json({ schedules });
});

export default router;
