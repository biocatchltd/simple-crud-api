import { fastify } from "./fwInstances";
import { readRoute } from "./routes/read";
import { createRoute } from "./routes/create";
import { updateRoute } from "./routes/update";
import { deleteRoute } from "./routes/delete";
fastify.register((api: any, opts: any, done: any) => {
  api.route(readRoute);
  api.route(createRoute);
  api.route(updateRoute);
  api.route(deleteRoute);
  done();
});

const run = async () => {
  try {
    await fastify.listen({ host: "0.0.0.0", port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
run();
