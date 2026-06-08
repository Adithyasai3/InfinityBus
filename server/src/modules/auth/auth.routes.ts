import { Router } from "express";
import {
  register,
  login,
} from "./auth.controller";
import {
  auth,
  requireRole,
} from "../../middleware/auth.middleware";
import prisma from "../../prisma/prisma";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", auth, async (req, res) => {
  const userId = (req as any).userId;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      role: true,
      createdAt: true,
    },
  });

  res.json(user);
});

router.get(
  "/admin",
  auth,
  requireRole("ADMIN"),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
    });
  }
);

export default router;