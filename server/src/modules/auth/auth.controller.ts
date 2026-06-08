import { Request, Response } from "express";
import {
  registerService,
  loginService,
} from "./auth.service";

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
    } = req.body;

    const user = await registerService(
      name,
      email,
      password,
      phoneNumber
    );

    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const token = await loginService(
      email,
      password
    );

    res.json({
      token,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};