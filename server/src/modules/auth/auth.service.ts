import prisma from "../../prisma/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/*
|--------------------------------------------------------------------------
| Register Service
|--------------------------------------------------------------------------
| Purpose:
| - Check whether user already exists.
| - Hash password.
| - Create new user in database.
| - Return created user.
|
| Flow:
| Controller
|   ↓
| registerService()
|   ↓
| Check Email
|   ↓
| Hash Password
|   ↓
| Create User
|   ↓
| Return User
|--------------------------------------------------------------------------
*/
export const registerService = async (
  name: string,
  email: string,
  password: string,
  phoneNumber: string
) => {

  /*
  |--------------------------------------------------------------------------
  | Check Existing User
  |--------------------------------------------------------------------------
  | Search user using email.
  | Email must be unique.
  |--------------------------------------------------------------------------
  */
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // Stop registration if email already exists
  if (existingUser) {
    throw new Error("User already exists");
  }

  /*
  |--------------------------------------------------------------------------
  | Hash Password
  |--------------------------------------------------------------------------
  | Never store plain text passwords.
  |
  | bcrypt.hash(password, saltRounds)
  |
  | 10 = Salt Rounds
  | Higher value = More secure but slower
  |--------------------------------------------------------------------------
  */
  const hashedPassword = await bcrypt.hash(password, 10);

  /*
  |--------------------------------------------------------------------------
  | Create User
  |--------------------------------------------------------------------------
  | Store hashed password in database.
  |--------------------------------------------------------------------------
  */
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    },
  });

  return user;
};

/*
|--------------------------------------------------------------------------
| Login Service
|--------------------------------------------------------------------------
| Purpose:
| - Find user by email.
| - Verify password.
| - Generate JWT token.
| - Return token.
|
| Flow:
| Controller
|   ↓
| loginService()
|   ↓
| Find User
|   ↓
| Compare Password
|   ↓
| Generate JWT
|   ↓
| Return Token
|--------------------------------------------------------------------------
*/
export const loginService = async (
  email: string,
  password: string
) => {

  /*
  |--------------------------------------------------------------------------
  | Find User By Email
  |--------------------------------------------------------------------------
  */
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // User not found
  if (!user) {
    throw new Error("User not found");
  }

  /*
  |--------------------------------------------------------------------------
  | Compare Password
  |--------------------------------------------------------------------------
  | Compares:
  | Entered Password
  | vs
  | Hashed Password from Database
  |--------------------------------------------------------------------------
  */
  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  // Password mismatch
  if (!isPasswordValid) {
  throw new Error("Invalid password");
}

console.log("USER:", user);
console.log("USER ROLE:", user.role);

const token = jwt.sign(
  {
    userId: user.id,
    role: user.role,
  },
  "mysecretkey"
);

console.log("TOKEN CREATED");

return token;
};