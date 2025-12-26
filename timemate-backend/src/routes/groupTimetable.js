import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();
const DAYS = ["MON","TUE","WED","THU","FRI","SAT","SUN"];

router.get("/groups/:groupId/timetable", requireAuth, async (req, res) => {
  const { groupId } = req.params;

  // 그룹 멤버 확인
  const members = await prisma.groupMember.findMany({
    where: { groupId },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          schedules: true,
        },
      },
    },
  });

  if (members.length === 0) {
    return res.status(404).json({ message: "Group not found or empty" });
  }

  const users = members.map(m => m.user);
  const total = users.length;

  const grid = {};

  for (const day of DAYS) {
    grid[day] = {};

    for (let hour = 0; hour < 24; hour++) {
      const busy = [];
      const free = [];

      for (const user of users) {
        const hasClass = user.schedules.some(s =>
          s.day === day &&
          s.startHour <= hour &&
          s.endHour > hour
        );

        if (hasClass) busy.push(user.name);
        else free.push(user.name);
      }

      grid[day][hour] = {
        busy,
        free,
        ratio: busy.length / total,
      };
    }
  }

  res.json({
    members: users.map(u => ({ id: u.id, name: u.name })),
    grid,
  });
});

export default router;
