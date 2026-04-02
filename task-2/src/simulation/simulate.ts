import { ARRIVAL_PROBABILITY_PER_TICK, CHARGING_DEMAND } from "./data";

const TICKS_PER_YEAR = 35040;
const TICKS_PER_DAY = 96;
const TICK_DURATION_HOURS = 0.25; // 15 minutes

export interface SimulationParams {
  numChargepoints: number;
  arrivalMultiplier: number; // 0.2–2.0, scales arrival probability
  consumptionKwh: number;
  chargingPowerKw: number;
  seed?: number;
}

export interface SimulationResult {
  totalEnergyKwh: number;
  theoreticalMaxPowerKw: number;
  actualMaxPowerKw: number;
  concurrencyFactor: number;
  chargingEvents: number;
  exemplaryDayPower: number[]; // average kW per 15-min slot across all days
}

function kmToKwh(km: number, consumptionKwh: number): number {
  return (km * consumptionKwh) / 100;
}

function kwhToTicks(kwh: number, chargingPowerKw: number): number {
  return Math.ceil(kwh / chargingPowerKw / TICK_DURATION_HOURS);
}

function sampleChargingDemand(random: number): number {
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

export function simulate(params: SimulationParams): SimulationResult {
  const {
    numChargepoints,
    arrivalMultiplier,
    consumptionKwh,
    chargingPowerKw,
    seed,
  } = params;
  const rng = seed !== undefined ? createRng(seed) : Math.random;

  // Track ticks of charge remaining for each chargepoint (0 = free)
  const chargepoints = new Array<number>(numChargepoints).fill(0);

  let totalEnergyKwh = 0;
  let actualMaxPowerKw = 0;
  let chargingEvents = 0;
  const dayPowerTotals = new Array<number>(TICKS_PER_DAY).fill(0);

  for (let tick = 0; tick < TICKS_PER_YEAR; tick++) {
    const hour = Math.floor((tick % TICKS_PER_DAY) / 4);
    const arrivalProbability =
      ARRIVAL_PROBABILITY_PER_TICK[hour]! * arrivalMultiplier;

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
          chargepoints[i] = kwhToTicks(
            kmToKwh(km, consumptionKwh),
            chargingPowerKw,
          );
          chargingEvents++;
        }
      }

      // If still charging, add its power to the tick total
      if (chargepoints[i]! > 0) {
        tickPowerKw += chargingPowerKw;
      }
    }

    totalEnergyKwh += tickPowerKw * TICK_DURATION_HOURS;
    dayPowerTotals[tick % TICKS_PER_DAY]! += tickPowerKw;
    if (tickPowerKw > actualMaxPowerKw) {
      actualMaxPowerKw = tickPowerKw;
    }
  }

  const theoreticalMaxPowerKw = numChargepoints * chargingPowerKw;
  const concurrencyFactor = actualMaxPowerKw / theoreticalMaxPowerKw;
  const exemplaryDayPower = dayPowerTotals.map((total) => total / 365);

  return {
    totalEnergyKwh,
    theoreticalMaxPowerKw,
    actualMaxPowerKw,
    concurrencyFactor,
    chargingEvents,
    exemplaryDayPower,
  };
}
