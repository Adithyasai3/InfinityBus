import { Router } from "express";
import { auth, requireRole } from "../../middleware/auth.middleware";
import { createTripController } from "./trip.controller";

const router = Router();

router.post(
  "/",
  auth,
  requireRole("OPERATOR"),
  createTripController
);

export default router;