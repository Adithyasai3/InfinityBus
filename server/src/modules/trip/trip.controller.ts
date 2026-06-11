import { Request, Response } from "express";
import * as tripService from "./trip.service";

export const createTripController = async (
  req: Request,
  res: Response
) => {
  try {

    const trip = await tripService.createTripService(
      req.body
    );

    return res.status(201).json({
      message: "Trip created successfully",
      trip,
    });

  } catch (error: any) {

    return res.status(400).json({
      message: error.message,
    });

  }
};