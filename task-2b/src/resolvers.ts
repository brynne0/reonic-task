import { PrismaClient } from "@prisma/client";
import { simulate } from "./simulation/simulate.js";

const prisma = new PrismaClient();

// Map each GraphQL operation to its implementation
export const resolvers = {
  Query: {
    // Return all simulations, newest first, with their results if already run
    simulations: () =>
      prisma.simulation.findMany({
        include: { result: true },
        orderBy: { createdAt: "desc" },
      }),

    // Fetch a simulation by ID
    simulation: (_: unknown, { id }: { id: string }) =>
      prisma.simulation.findUnique({
        where: { id },
        include: { result: true },
      }),
  },

  // Write to the database
  Mutation: {
    // Create a new simulation with the given inputs, falling back to defaults
    createSimulation: (
      _: unknown,
      {
        input,
      }: {
        input?: {
          numChargepoints?: number;
          arrivalMultiplier?: number;
          consumptionKwh?: number;
          chargingPowerKw?: number;
        };
      },
    ) =>
      prisma.simulation.create({
        data: {
          numChargepoints: input?.numChargepoints ?? 20,
          arrivalMultiplier: input?.arrivalMultiplier ?? 1.0,
          consumptionKwh: input?.consumptionKwh ?? 18,
          chargingPowerKw: input?.chargingPowerKw ?? 11,
        },
        include: { result: true },
      }),

    // Update the input parameters of an existing simulation
    updateSimulation: (
      _: unknown,
      {
        id,
        input,
      }: {
        id: string;
        input: {
          numChargepoints?: number;
          arrivalMultiplier?: number;
          consumptionKwh?: number;
          chargingPowerKw?: number;
        };
      },
    ) =>
      prisma.simulation.update({
        where: { id },
        data: input,
        include: { result: true },
      }),

    // Delete a simulation
    deleteSimulation: async (_: unknown, { id }: { id: string }) => {
      await prisma.simulation.delete({ where: { id } });
      return true;
    },

    // Run the real simulation (from task 1) and store/overwrite the result in the database
    runSimulation: async (_: unknown, { id }: { id: string }) => {
      const simulation = await prisma.simulation.findUniqueOrThrow({
        where: { id },
      });

      const raw = simulate({
        numChargepoints: simulation.numChargepoints,
        arrivalMultiplier: simulation.arrivalMultiplier,
        consumptionKwh: simulation.consumptionKwh,
        chargingPowerKw: simulation.chargingPowerKw,
        seed: 42,
      });

      const output = {
        totalEnergyKwh: raw.totalEnergyKwh,
        actualMaxPowerKw: raw.actualMaxPowerKw,
        theoreticalMaxPowerKw: raw.theoreticalMaxPowerKw,
        concurrencyFactor: raw.concurrencyFactor,
        chargingEventsYear: raw.chargingEvents,
        chargingEventsMonth: Math.round(raw.chargingEvents / 12),
        chargingEventsWeek: Math.round(raw.chargingEvents / 52),
        chargingEventsDay: Math.round(raw.chargingEvents / 365),
        exemplaryDayKw: raw.exemplaryDayPower,
      };

      // Upsert so re-running a simulation replaces the old result rather than creating a duplicate
      return prisma.simulationResult.upsert({
        where: { simulationId: id },
        create: { simulationId: id, ...output },
        update: output,
      });
    },
  },

  // Prisma stores this as JSON, so cast to number[] for the GraphQL schema
  SimulationResult: {
    exemplaryDayKw: (parent: { exemplaryDayKw: unknown }) =>
      parent.exemplaryDayKw as number[],
  },
};
