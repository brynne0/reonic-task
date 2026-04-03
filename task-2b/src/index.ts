import { createServer } from "node:http";
import { createSchema, createYoga } from "graphql-yoga";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";

const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
});

const server = createServer(yoga);
const PORT = process.env.PORT ?? 3000;
server.listen(PORT, () => console.log(`GraphQL server running on http://localhost:${PORT}/graphql`));
