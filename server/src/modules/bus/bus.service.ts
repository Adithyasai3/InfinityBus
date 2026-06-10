import prisma from "../../prisma/prisma";
import { BusType } from "@prisma/client";
// Service function to create a new bus
export const createBus = async (
  busData: {
    busNumber: string;
    busName: string;
    busType: BusType;
    totalSeats: number;
  },
  operatorId: string
) => {
  // Check whether a bus with the same bus number already exists.
  // findUnique() can only be used on fields marked as @unique in schema.prisma.
  const existingBus = await prisma.bus.findUnique({
    where: {
      busNumber: busData.busNumber,
    },
  });

  // Prevent duplicate bus registrations.
  if (existingBus) {
    throw new Error("Bus already exists");
  }

  // Create a new bus record in the database.
  const createdBus = await prisma.bus.create({
    data: {
      // Bus details received from the controller/request
      busNumber: busData.busNumber,
      busName: busData.busName,
      busType: busData.busType,
      totalSeats: busData.totalSeats,

      // Associate the bus with the logged-in operator
      operatorId: operatorId,
    },
  });

  // Return the newly created bus object
  return createdBus;
};

export const getAllBusesService = async () => {
  const busesList = await prisma.bus.findMany();

  return busesList;
};


export const getBusByIdService = async (
  busId: string
) => {
  const bus = await prisma.bus.findUnique({
    where: {
      id: busId,
    },
  });

  if (!bus) {
    throw new Error("Bus not found");
  }

  return bus;
};

export const updateBusService = async (
  busId: string,
  busData: {
    busNumber?: string;
    busName?: string;
    busType?: BusType;
    totalSeats?: number;
  }
) => {

  const existingBus =
    await prisma.bus.findUnique({
      where: {
        id: busId,
      },
    });

  if (!existingBus) {
    throw new Error("Bus not found");
  }

  const updatedBus =
    await prisma.bus.update({
      where: {
        id: busId,
      },
      data: busData,
    });

  return updatedBus;
};

export const deleteBusService = async (
  busId: string
) => {

  const existingBus =
    await prisma.bus.findUnique({
      where: {
        id: busId,
      },
    });

  if (!existingBus) {
    throw new Error("Bus not found");
  }

  const deletedBus =
    await prisma.bus.delete({
      where: {
        id: busId,
      },
    });

  return deletedBus;
};


