import { FastifyReply } from "fastify";
import { fastify } from "../fwInstances";

type deleteInputArgs = {
  sessionId: string;
};

const deleteInput = {
  type: "object",
  properties: {
    sessionId: { type: "string" },
  },
};

const deleteOutput = {
  type: "object",
  properties: {
    sessionId: { type: "string" },
  },
};

export const deleteRoute = {
  method: "DELETE",
  url: "/delete",
  handler: async (req: any, reply: FastifyReply) => {
    const client = await fastify.pg.connect();
    const { body: input } = req;
    try {
      const { rows } = await client.query(
        "UPDATE sessions SET DELETED = True WHERE SESSION_ID = $1 returning SESSION_ID",
        [input.sessionId]
      );
      reply.send({ sessionId: rows[0].session_id });
    } finally {
      client.release();
    }
  },
  schema: {
    body: deleteInput,
    response: {
      200: deleteOutput,
    },
  },
};
