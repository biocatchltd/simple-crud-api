import Fastify from "fastify";
import pg from "@fastify/postgres";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { readRoute } from "./routes/read";
import { createRoute } from "./routes/create";
import { updateRoute } from "./routes/update";
import { deleteRoute } from "./routes/delete";

export const fastify = Fastify({
  logger: true,
});

fastify.register(pg, {
  connectionString: `${process.env.DB_HOST}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
});

fastify.register((api: any, opts: any, done: any) => {
  api.route(readRoute);
  api.route(createRoute);
  api.route(updateRoute);
  api.route(deleteRoute);
  done();
});

fastify.register(swagger, {});
fastify.register(swaggerUI, {
  routePrefix: "/docs",
});