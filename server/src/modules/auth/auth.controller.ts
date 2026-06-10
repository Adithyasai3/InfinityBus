import { Request, Response } from "express";
import {
  registerService,
  loginService,
} from "./auth.service";

/*
|--------------------------------------------------------------------------
| Register Controller
|--------------------------------------------------------------------------
| Purpose:
| - Receives registration data from client.
| - Calls service layer to create user.
| - Sends created user back to client.
|
| Flow:
| Client
|   ↓
| Controller
|   ↓
| Service
|   ↓
| Database
|--------------------------------------------------------------------------
*/
export const register = async (
  req: Request,
  res: Response
) => {
  try {

    /*
    |--------------------------------------------------------------------------
    | Extract Data From Request Body
    |--------------------------------------------------------------------------
    | Example Request:
    |
    | {
    |   "name": "Adi",
    |   "email": "adi@gmail.com",
    |   "password": "123456",
    |   "phoneNumber": "9876543210"
    | }
    |--------------------------------------------------------------------------
    */
    const {
      name,
      email,
      password,
      phoneNumber,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Call Service Layer
    |--------------------------------------------------------------------------
    | Service handles:
    | - Email validation
    | - Password hashing
    | - User creation
    |--------------------------------------------------------------------------
    */
    const user = await registerService(
      name,
      email,
      password,
      phoneNumber
    );

    /*
    |--------------------------------------------------------------------------
    | Success Response
    |--------------------------------------------------------------------------
    | 201 = Resource Created Successfully
    |--------------------------------------------------------------------------
    */
    res.status(201).json(user);

  } catch (error: any) {

    /*
    |--------------------------------------------------------------------------
    | Error Response
    |--------------------------------------------------------------------------
    | Example:
    | - Email already exists
    | - Validation failure
    |--------------------------------------------------------------------------
    */
    res.status(400).json({
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Login Controller
|--------------------------------------------------------------------------
| Purpose:
| - Receives email & password.
| - Calls login service.
| - Returns JWT token.
|
| Flow:
| Client
|   ↓
| Controller
|   ↓
| Service
|   ↓
| Verify Password
|   ↓
| Generate JWT
|   ↓
| Return Token
|--------------------------------------------------------------------------
*/
export const login = async (
  req: Request,
  res: Response
) => {
  try {

    /*
    |--------------------------------------------------------------------------
    | Extract Login Credentials
    |--------------------------------------------------------------------------
    | Example Request:
    |
    | {
    |   "email": "adi@gmail.com",
    |   "password": "123456"
    | }
    |--------------------------------------------------------------------------
    */
    const { email, password } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Call Login Service
    |--------------------------------------------------------------------------
    | Service handles:
    | - User lookup
    | - Password comparison
    | - JWT generation
    |--------------------------------------------------------------------------
    */
    const token = await loginService(
      email,
      password
    );

    /*
    |--------------------------------------------------------------------------
    | Success Response
    |--------------------------------------------------------------------------
    | Return JWT token to client
    |--------------------------------------------------------------------------
    */
    res.json({
      token,
    });

  } catch (error: any) {

    /*
    |--------------------------------------------------------------------------
    | Error Response
    |--------------------------------------------------------------------------
    | Example:
    | - User not found
    | - Invalid password
    |--------------------------------------------------------------------------
    */
    res.status(400).json({
      message: error.message,
    });
  }
};