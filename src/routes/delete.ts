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
  handler: async (input: deleteInputArgs) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query(
        "UPDATE sessions SET DELETED = True WHERE sessionId = $1 returning SESSION_ID",
        [input.sessionId]
      );
      return rows;
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
