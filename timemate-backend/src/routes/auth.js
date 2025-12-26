import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const router = Router();

const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
});

router.post("/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input", issues: parsed.error.issues });
  }

  const { email, name, password } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ message: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, name, passwordHash },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  return res.status(201).json({ user });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input", issues: parsed.error.issues });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET is not set" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

export default router;
