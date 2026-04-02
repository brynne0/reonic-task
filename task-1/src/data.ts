// T1: Probability distribution of an EV arriving at a chargepoint at a given time
export const ARRIVAL_PROBABILITY_PER_HOUR: number[] = [
  0.0094, 0.0094, 0.0094, 0.0094, 0.0094, 0.0094, 0.0094, 0.0094, 0.0283,
  0.0283, 0.0566, 0.0566, 0.0566, 0.0755, 0.0755, 0.0755, 0.1038, 0.1038,
  0.1038, 0.0472, 0.0472, 0.0472, 0.0094, 0.0094,
];

export const ARRIVAL_PROBABILITY_PER_TICK: number[] =
  ARRIVAL_PROBABILITY_PER_HOUR.map((p) => p / 4);

// T2: Probability distribution of an EV's charging needs
export const KWH_PER_100KM = 18; // 18 kWh per 100km

export const CHARGING_DEMAND: { probability: number; km: number }[] = [
  { probability: 0.3431, km: 0 },
  { probability: 0.049, km: 5 },
  { probability: 0.098, km: 10 },
  { probability: 0.1176, km: 20 },
  { probability: 0.0882, km: 30 },
  { probability: 0.1176, km: 50 },
  { probability: 0.1078, km: 100 },
  { probability: 0.049, km: 200 },
  { probability: 0.0294, km: 300 },
];
