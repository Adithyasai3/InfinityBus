import prisma from "../../prisma/prisma";

export const createTripService = async (
  tripData: {
    busId: string;
    source: string;
    destination: string;
    departureTime: Date;
    arrivalTime: Date;
    fare: number;
  }
) => {

  // Check if bus exists
  const bus = await prisma.bus.findUnique({
    where: {
      id: tripData.busId,
    },
  });

  if (!bus) {
    throw new Error("Bus not found");
  }

  // Create trip
  const createdTrip = await prisma.trip.create({
    data: {
      busId: tripData.busId,
      source: tripData.source,
      destination: tripData.destination,
      departureTime: tripData.departureTime,
      arrivalTime: tripData.arrivalTime,
      fare: tripData.fare,

      // Automatically set available seats
      availableSeats: bus.totalSeats,
    },
  });

  return createdTrip;
};