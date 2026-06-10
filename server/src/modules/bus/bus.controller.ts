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


export const getAllBusesController = async (
  req: Request,
  res: Response
) => {
  try {
    const buses = await busService.getAllBusesService();

    return res.status(200).json({
      message: "Buses fetched successfully",
      buses,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getBusByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const busId = req.params.id as string;

    const bus = await busService.getBusByIdService(
      busId
    );

    return res.status(200).json({
      message: "Bus fetched successfully",
      bus,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: error.message,
    });
  }
};