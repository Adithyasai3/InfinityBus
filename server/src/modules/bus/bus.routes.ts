import {Router} from "express";
import  {createBus} from "./bus.controller";
import { auth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/auth.middleware";
import { deflate } from "node:zlib";

const router = Router();

router.post("/",auth,requireRole("OPERATOR"),createBus);

export default router;
