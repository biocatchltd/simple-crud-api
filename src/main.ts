import { fastify as server } from "./fwInstances";

const run = async () => {
  try {
    await server.listen({ host: "0.0.0.0", port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
run();
