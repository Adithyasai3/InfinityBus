import { Request, Response } from "express";
import * as busService from "./bus.service";

/**
 * Create a new bus.
 *
 * Flow:
 * 1. Operator sends bus details in request body.
 * 2. Auth middleware verifies JWT token.
 * 3. Auth middleware attaches user data to req.user.
 * 4. Controller passes data to service layer.
 * 5. Service creates and saves the bus in database.
 * 6. Success response is returned to client.
 */
export const createBus = async (
  req: Request,
  res: Response
) => {
  try {
    // Bus details sent by client (bus number, seats, route, etc.)
    // Logged-in operator id comes from JWT auth middleware
   
    const operatorId = (req as any).userId;

    const bus = await busService.createBus(
      req.body,
      operatorId
    );

    // Return success response after bus is created
    return res.status(201).json({
      message: "Bus created successfully",
      bus,
    });
  } catch (error: any) {
    // Handles validation errors, database errors,
    // duplicate bus numbers, and other service errors
    return res.status(400).json({
      message: error.message,
    });
  }
};