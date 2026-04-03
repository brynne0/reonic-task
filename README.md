# Reonic Coding Task

Brynne O'Brien

## Task 1 — Simulation Logic

TypeScript and Node.js

```bash
cd task-1
npm install
npm start
```

**Bonus notes**

- Concurrency factor decreases as chargepoint count increases and stabilises in the 35–45% range by 30 chargepoints.
- I chose to ignore DST as the effect on annual totals is negligible (2 hours out of 8,760). Moving clocks forward loses 4 ticks (92 vs 96), moving clocks back gains 4 (100 vs 96). Both are in the 0.94% arrival band and net to zero across the year.
- Seeded RNG (xorshift, seed 42) used throughout for reproducible results. Without a seed, the simulation produces different results each time, making outputs difficult to compare across chargepoint counts.

## Task 2a — Frontend

React, TypeScript and Tailwind

```bash
cd task-2a
npm install
npm run dev
```

- Standard mode: configure chargepoints, arrival multiplier, consumption, charging power and view live stats with exemplary day chart
- Custom mode (bonus): create mixed chargepoint groups and view concurrency factor across 1–30 chargepoints

## Task 2b — Backend

TypeScript, Node.js, GraphQL, Prisma, PostgreSQL and Docker

```bash
cd task-2b
docker compose up --build
# http://localhost:3000/graphql
```

```bash
docker compose down
```

**Example queries**

```graphql
# Create
mutation {
  createSimulation(input: { numChargepoints: 20, arrivalMultiplier: 1.0, consumptionKwh: 18, chargingPowerKw: 11 }) {
    id
  }
}

# Read all
query {
  simulations {
    id
    numChargepoints
    result { totalEnergyKwh concurrencyFactor }
  }
}

# Read one
query {
  simulation(id: "<id>") {
    id
    numChargepoints
    result { totalEnergyKwh concurrencyFactor }
  }
}

# Update
mutation {
  updateSimulation(id: "<id>", input: { numChargepoints: 10 }) {
    id
    numChargepoints
  }
}

# Delete
mutation {
  deleteSimulation(id: "<id>")
}

# Run simulation
mutation {
  runSimulation(id: "<id>") {
    totalEnergyKwh
    actualMaxPowerKw
    theoreticalMaxPowerKw
    concurrencyFactor
    chargingEventsYear
    exemplaryDayKw
  }
}
```
