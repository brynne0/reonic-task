export const typeDefs = /* GraphQL */ `
  type Simulation {
    id: ID!
    createdAt: String!
    updatedAt: String!
    numChargepoints: Int!
    arrivalMultiplier: Float!
    consumptionKwh: Float!
    chargingPowerKw: Float!
    result: SimulationResult
  }

  type SimulationResult {
    id: ID!
    createdAt: String!
    totalEnergyKwh: Float!
    chargingEventsYear: Int!
    chargingEventsMonth: Int!
    chargingEventsWeek: Int!
    chargingEventsDay: Int!
    concurrencyFactor: Float!
    actualMaxPowerKw: Float!
    exemplaryDayKw: [Float!]!
  }

  input CreateSimulationInput {
    numChargepoints: Int
    arrivalMultiplier: Float
    consumptionKwh: Float
    chargingPowerKw: Float
  }

  input UpdateSimulationInput {
    numChargepoints: Int
    arrivalMultiplier: Float
    consumptionKwh: Float
    chargingPowerKw: Float
  }

  type Query {
    simulations: [Simulation!]!
    simulation(id: ID!): Simulation
  }

  type Mutation {
    createSimulation(input: CreateSimulationInput): Simulation!
    updateSimulation(id: ID!, input: UpdateSimulationInput!): Simulation!
    deleteSimulation(id: ID!): Boolean!
    runSimulation(id: ID!): SimulationResult!
  }
`;
