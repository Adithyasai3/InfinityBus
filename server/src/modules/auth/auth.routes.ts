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

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
| These routes do not require authentication.
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
| POST /api/register
|
| Request Body:
| {
|   "name": "Adi",
|   "email": "adi@gmail.com",
|   "password": "123456",
|   "phoneNumber": "9876543210"
| }
|--------------------------------------------------------------------------
*/
router.post("/register", register);

/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
| POST /api/login
|
| Request Body:
| {
|   "email": "adi@gmail.com",
|   "password": "123456"
| }
|
| Response:
| {
|   "token": "jwt_token"
| }
|--------------------------------------------------------------------------
*/
router.post("/login", login);

/*
|--------------------------------------------------------------------------
| Get Current Logged In User
|--------------------------------------------------------------------------
| GET /api/me
|
| Protected Route
|
| Flow:
| Request
|   ↓
| auth middleware
|   ↓
| JWT verified
|   ↓
| userId attached to req
|   ↓
| Fetch user from database
|   ↓
| Return user profile
|--------------------------------------------------------------------------
*/
router.get("/me", auth, async (req, res) => {

  // userId comes from auth middleware
  const userId = (req as any).userId;

  /*
  |--------------------------------------------------------------------------
  | Fetch User By ID
  |--------------------------------------------------------------------------
  | findUnique() searches using unique field.
  | Here id is unique.
  |--------------------------------------------------------------------------
  */
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },

    /*
    |--------------------------------------------------------------------------
    | select
    |--------------------------------------------------------------------------
    | Only return required fields.
    | Password is intentionally excluded.
    |--------------------------------------------------------------------------
    */
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

/*
|--------------------------------------------------------------------------
| Admin Only Route
|--------------------------------------------------------------------------
| GET /api/admin
|
| Flow:
|
| Request
|   ↓
| auth
|   ↓
| JWT Verification
|   ↓
| requireRole("ADMIN")
|   ↓
| Role Check
|   ↓
| Success / Denied
|--------------------------------------------------------------------------
*/
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