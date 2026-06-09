import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  // Supports both:
  // Authorization: Bearer <token>
  // Authorization: <token>
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(
      token,
      "mysecretkey"
    ) as {
      userId: string;
      role: string;
    };

    console.log("DECODED:", decoded);

    (req as any).userId = decoded.userId;
    (req as any).role = decoded.role;

    console.log("USER ID:", (req as any).userId);
    console.log("ROLE:", (req as any).role);

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

export const requireRole = (requiredRole: string) => {
  return (req: any, res: any, next: any) => {
    console.log("REQUIRED ROLE:", requiredRole);
    console.log("REQUEST ROLE:", req.role);

    if (req.role !== requiredRole) {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    next();
  };
};