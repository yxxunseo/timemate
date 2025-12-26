import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

/**
 * 그룹 생성
 * body: { name }
 * - 생성자는 Group.ownerId
 * - 생성자는 GroupMember로 OWNER 자동 등록
 */
router.post("/", requireAuth, async (req, res) => {
  const schema = z.object({ name: z.string().min(1).max(30) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid body" });

  const group = await prisma.group.create({
    data: {
      name: parsed.data.name,
      ownerId: req.userId,
      members: {
        create: {
          userId: req.userId,
          role: "OWNER",
        },
      },
    },
    select: { id: true, name: true, ownerId: true, createdAt: true },
  });

  return res.status(201).json({ group });
});

/**
 * 그룹에 친구 초대 (친구만 가능)
 * body: { userId }  // 초대할 유저ID
 */
router.post("/:groupId/invite", requireAuth, async (req, res) => {
  const { groupId } = req.params;

  const schema = z.object({ userId: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid body" });

  const inviteeId = parsed.data.userId;

  // 1) 그룹 존재 확인
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: { id: true, ownerId: true },
  });
  if (!group) return res.status(404).json({ message: "Group not found" });

  // 2) 초대 권한: 일단 OWNER만 초대 가능하게 (원하면 MEMBER도 가능하게 바꿀 수 있음)
  if (group.ownerId !== req.userId) {
    return res.status(403).json({ message: "Only owner can invite" });
  }

  // 3) "친구인지" 체크 (핵심!!)
  const isFriend = await prisma.friendship.findFirst({
    where: { userId: req.userId, friendId: inviteeId },
    select: { id: true },
  });
  if (!isFriend) {
    return res.status(403).json({ message: "You can invite friends only" });
  }

  // 4) 이미 멤버인지 체크 + 추가
  try {
    const member = await prisma.groupMember.create({
      data: { groupId, userId: inviteeId, role: "MEMBER" },
      select: { id: true, groupId: true, userId: true, role: true, joinedAt: true },
    });
    return res.status(201).json({ member });
  } catch (e) {
    return res.status(409).json({ message: "Already a member" });
  }
});

/**
 * 그룹 멤버 목록
 */
router.get("/:groupId/members", requireAuth, async (req, res) => {
  const { groupId } = req.params;

  // 내 그룹인지 체크(멤버만 조회 가능)
  const me = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: req.userId } },
    select: { id: true },
  });
  if (!me) return res.status(403).json({ message: "Not a member" });

  const members = await prisma.groupMember.findMany({
    where: { groupId },
    orderBy: { joinedAt: "asc" },
    select: {
      role: true,
      joinedAt: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return res.json({
    members: members.map((m) => ({ ...m.user, role: m.role, joinedAt: m.joinedAt })),
  });
});

export default router;
