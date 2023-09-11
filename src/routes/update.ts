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
  handler: async (input: updateInputArgs) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query(
        "UPDATE sessions SET SCORE = $2 WHERE SESSION_ID = $1 returning SESSION_ID",
        [input.sessionId, input.score]
      );
      return rows;
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
