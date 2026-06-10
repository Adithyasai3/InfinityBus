import { Router } from "express";
import { createBus, getAllBusesController,getBusByIdController } from "./bus.controller";
import { auth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/auth.middleware";

// ❌ Not needed here
// import { deflate } from "node:zlib";

const router = Router();

/*
|--------------------------------------------------------------------------
| Create Bus Route
|--------------------------------------------------------------------------
| POST /api/buses
|
| Purpose:
| - Allows operators to create a new bus.
|
| Middleware Flow:
|
| Request
|   ↓
| auth
|   ↓
| Verify JWT Token
|   ↓
| Extract userId & role
|   ↓
| requireRole("OPERATOR")
|   ↓
| Check Role
|   ↓
| createBus Controller
|--------------------------------------------------------------------------
*/
router.post(
  "/",
  auth,
  requireRole("OPERATOR"),
  createBus
);


router.get("/",auth,getAllBusesController);

router.get(
  "/:id",
  auth,
  getBusByIdController
);

export default router;