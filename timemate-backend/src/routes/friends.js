import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

const requestSchema = z.object({
  toUserId: z.string().min(1),
});

// 1) 친구 요청 보내기 (ID로)
router.post("/request", requireAuth, async (req, res) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const fromId = req.userId;
  const { toUserId: toId } = parsed.data;

  if (fromId === toId) return res.status(400).json({ message: "Cannot friend yourself" });

  const toUser = await prisma.user.findUnique({ where: { id: toId }, select: { id: true } });
  if (!toUser) return res.status(404).json({ message: "User not found" });

  // 이미 친구면 막기
  const alreadyFriends = await prisma.friendship.findFirst({
    where: { userId: fromId, friendId: toId },
    select: { id: true },
  });
  if (alreadyFriends) return res.status(409).json({ message: "Already friends" });

  // 반대 방향 요청이 pending이면 "수락" 유도 (여기서는 막거나 자동수락 둘 중 선택)
  const reversePending = await prisma.friendRequest.findFirst({
    where: { fromId: toId, toId: fromId, status: "PENDING" },
    select: { id: true },
  });
  if (reversePending) {
    return res.status(409).json({ message: "They already requested you. Accept it instead." });
  }

  try {
    const fr = await prisma.friendRequest.create({
      data: { fromId, toId },
      select: { id: true, fromId: true, toId: true, status: true, createdAt: true },
    });
    return res.status(201).json({ request: fr });
  } catch (e) {
    // @@unique(fromId,toId) 때문에 중복 요청 시 여기로 옴
    return res.status(409).json({ message: "Friend request already exists" });
  }
});

// 2) 내가 받은 친구 요청 목록
router.get("/requests/received", requireAuth, async (req, res) => {
  const list = await prisma.friendRequest.findMany({
    where: { toId: req.userId, status: "PENDING" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      from: { select: { id: true, name: true, email: true } },
    },
  });

  return res.json({ requests: list });
});

// 3) 내가 보낸 친구 요청 목록(선택)
router.get("/requests/sent", requireAuth, async (req, res) => {
  const list = await prisma.friendRequest.findMany({
    where: { fromId: req.userId, status: "PENDING" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      to: { select: { id: true, name: true, email: true } },
    },
  });

  return res.json({ requests: list });
});

// 4) 친구 요청 수락
router.post("/requests/:requestId/accept", requireAuth, async (req, res) => {
  const { requestId } = req.params;

  const fr = await prisma.friendRequest.findUnique({
    where: { id: requestId },
    select: { id: true, fromId: true, toId: true, status: true },
  });
  if (!fr) return res.status(404).json({ message: "Request not found" });
  if (fr.toId !== req.userId) return res.status(403).json({ message: "Not your request" });
  if (fr.status !== "PENDING") return res.status(409).json({ message: "Request already handled" });

  // 수락 시: FriendRequest 상태 변경 + Friendship 양방향 생성(트랜잭션)
  await prisma.$transaction([
    prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: "ACCEPTED" },
    }),
    prisma.friendship.createMany({
      data: [
        { userId: fr.fromId, friendId: fr.toId },
        { userId: fr.toId, friendId: fr.fromId },
      ],
      skipDuplicates: true,
    }),
  ]);

  return res.json({ ok: true });
});

// 5) 친구 요청 거절
router.post("/requests/:requestId/reject", requireAuth, async (req, res) => {
  const { requestId } = req.params;

  const fr = await prisma.friendRequest.findUnique({
    where: { id: requestId },
    select: { id: true, toId: true, status: true },
  });
  if (!fr) return res.status(404).json({ message: "Request not found" });
  if (fr.toId !== req.userId) return res.status(403).json({ message: "Not your request" });
  if (fr.status !== "PENDING") return res.status(409).json({ message: "Request already handled" });

  await prisma.friendRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED" },
  });

  return res.json({ ok: true });
});

// 6) 내 친구 목록
router.get("/", requireAuth, async (req, res) => {
  const list = await prisma.friendship.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
    select: {
      friend: { select: { id: true, name: true, email: true } },
      createdAt: true,
    },
  });

  return res.json({
    friends: list.map(x => ({ ...x.friend, friendedAt: x.createdAt })),
  });
});

export default router;
