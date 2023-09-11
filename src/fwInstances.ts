import Fastify from "fastify";
import pg from "@fastify/postgres";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

export const fastify = Fastify({
  logger: true,
});

fastify.register(pg, {
  connectionString: `${process.env.DB_HOST}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
});

fastify.register(swagger, {});
fastify.register(swaggerUI, {
  routePrefix: "/docs",
});