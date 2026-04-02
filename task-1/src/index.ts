import { simulate } from "./simulate.js";

// Task 1: Simulate 20 chargepoints
const result = simulate(20, 42);
console.log("Task 1:\n");
console.log(`Total energy consumed: ${result.totalEnergyKwh.toFixed(2)} kWh`);
console.log(`Theoretical max power: ${result.theoreticalMaxPowerKw} kW`);
console.log(`Actual max power: ${result.actualMaxPowerKw} kW`);
console.log(
  `Concurrency factor: ${(result.concurrencyFactor * 100).toFixed(1)}%`,
);

// Bonus: Simulate 1–30 chargepoints
console.log("\nBonus:\n");
console.log("Chargepoints | Actual Max (kW) | Concurrency Factor");
console.log("-------------|-----------------|-------------------");

for (let n = 1; n <= 30; n++) {
  const r = simulate(n, 42);
  console.log(
    `${String(n).padStart(12)} | ${String(r.actualMaxPowerKw).padStart(15)} | ${`${(r.concurrencyFactor * 100).toFixed(1)}%`.padStart(18)}`,
  );
}
