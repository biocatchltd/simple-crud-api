import { FastifyReply } from "fastify";
import { fastify } from "../fwInstances";

const readOutput = {
  type: "array",
  items: {
    type: "object",
    properties: {
      sessionId: { type: "string" },
      timestamp: { type: "number" },
      customerId: { type: "string" },
      typingSpeed: { type: "number" },
      cursorHops: { type: "number" },
      ip: { type: "string" },
      passwordPasted: { type: "boolean" },
    },
  },
};

export const readRoute = {
  method: "GET",
  url: "/read",
  handler: async (_: any, reply: FastifyReply) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query("SELECT * FROM sessions");
      const parsedRows = rows.map((row) => ({
        sessionId: row.session_id,
        timestamp: row.timestamp,
        customerId: row.customer_id,
        typingSpeed: row.typing_speed,
        cursorHops: row.cursor_hops,
        ip: row.ip,
        passwordPasted: row.password_pasted,
      }));
      reply.send(rows);
    } finally {
      client.release();
    }
  },
  schema: {
    response: {
      200: readOutput,
    },
  },
};
