import { FastifyReply, FastifyRequest } from "fastify";
import { fastify } from "../fwInstances";

type updateInputArgs = {
  sessionId: string;
  score: number;
};

const updateInput = {
  type: "object",
  properties: {
    sessionId: { type: "string" },
    score: { type: "number" },
  },
};
const updateOutput = {
  type: "object",
  properties: {
    sessionId: { type: "string" },
  },
};

export const updateRoute = {
  method: "PUT",
  url: "/update",
  handler: async (req: any, reply: FastifyReply) => {
    const client = await fastify.pg.connect();
    const { body: input } = req;
    try {
      console.log({ input });
      const { rows } = await client.query(
        "UPDATE sessions SET SCORE = $2 WHERE SESSION_ID = $1 returning SESSION_ID",
        [input.sessionId, input.score]
      );
      reply.send({ sessionId: rows[0].session_id });
    } catch (err) {
      console.error(err);
      reply.status(500).send({ error: "Something went wrong" });
    } finally {
      client.release();
    }
  },
  schema: {
    body: updateInput,
    response: {
      200: updateOutput,
    },
  },
};
