import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();

const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

router.get("/", authenticateToken, async (req: any, res) => {
  const todos = await prisma.todo.findMany({
    where: { userId: req.user.userId },
  });
  res.json(todos);
});

router.post("/", authenticateToken, async (req: any, res) => {
  const { title } = req.body;
  const todo = await prisma.todo.create({
    data: {
      title,
      userId: req.user.userId,
    },
  });
  res.json(todo);
});

router.put("/:id", authenticateToken, async (req: any, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const todo = await prisma.todo.update({
    where: { id: parseInt(id) },
    data: { title, completed },
  });
  res.json(todo);
});

router.delete("/:id", authenticateToken, async (req: any, res) => {
  const { id } = req.params;
  await prisma.todo.delete({
    where: { id: parseInt(id) },
  });
  res.sendStatus(204);
});

export default router;
