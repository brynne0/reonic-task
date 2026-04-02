import {
  ARRIVAL_PROBABILITY_PER_TICK,
  CHARGING_DEMAND,
  KWH_PER_100KM,
} from "./data.js";

const CHARGING_POWER_KW = 11;
const TICKS_PER_YEAR = 35040;
const TICK_DURATION_HOURS = 0.25; // 15 minutes

export function kmToKwh(km: number): number {
  return (km * KWH_PER_100KM) / 100;
}

export function kwhToTicks(kwh: number): number {
  return Math.ceil(kwh / CHARGING_POWER_KW / TICK_DURATION_HOURS);
}

export function sampleChargingDemand(random: number): number {
  let cumulative = 0;
  for (const entry of CHARGING_DEMAND) {
    cumulative += entry.probability;
    if (random < cumulative) {
      return entry.km;
    }
  }
  // Floating point fallback (if probabilities do not sum to exactly 1.0)
  return CHARGING_DEMAND[CHARGING_DEMAND.length - 1]!.km;
}

// Returns a seeded random number generator for reproducible results
function createRng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface SimulationResult {
  totalEnergyKwh: number;
  theoreticalMaxPowerKw: number;
  actualMaxPowerKw: number;
  concurrencyFactor: number;
}

export function simulate(
  numChargepoints: number,
  seed?: number,
): SimulationResult {
  const rng = seed !== undefined ? createRng(seed) : Math.random;

  // Track ticks of charge remaining for each chargepoint (0 = free)
  const chargepoints = new Array<number>(numChargepoints).fill(0);

  let totalEnergyKwh = 0;
  let actualMaxPowerKw = 0;

  for (let tick = 0; tick < TICKS_PER_YEAR; tick++) {
    const hour = Math.floor((tick % 96) / 4);
    const arrivalProbability = ARRIVAL_PROBABILITY_PER_TICK[hour]!;

    let tickPowerKw = 0;

    for (let i = 0; i < numChargepoints; i++) {
      // If busy, decrement remaining ticks
      if (chargepoints[i]! > 0) {
        chargepoints[i] = chargepoints[i]! - 1;
      }

      // If free, check for a new arrival
      if (chargepoints[i] === 0 && rng() < arrivalProbability) {
        const km = sampleChargingDemand(rng());
        if (km > 0) {
          chargepoints[i] = kwhToTicks(kmToKwh(km));
        }
      }

      // If still charging, add its power to the tick total
      if (chargepoints[i]! > 0) {
        tickPowerKw += CHARGING_POWER_KW;
      }
    }

    totalEnergyKwh += tickPowerKw * TICK_DURATION_HOURS;
    if (tickPowerKw > actualMaxPowerKw) {
      actualMaxPowerKw = tickPowerKw;
    }
  }

  const theoreticalMaxPowerKw = numChargepoints * CHARGING_POWER_KW;
  const concurrencyFactor = actualMaxPowerKw / theoreticalMaxPowerKw;

  return {
    totalEnergyKwh,
    theoreticalMaxPowerKw,
    actualMaxPowerKw,
    concurrencyFactor,
  };
}
