import { fastify } from "../fwInstances";

type createInputArgs = {
  timestamp: number;
  customerId: string;
  typingSpeed: number;
  cursorHops: number;
  ip: string;
  passwordPasted: boolean;
  score?: number;
};

const createInput = {
  type: "object",
  properties: {
    timestamp: { type: "number" },
    customerId: { type: "string" },
    typingSpeed: { type: "number", format: "float" },
    cursorHops: { type: "number" },
    ip: { type: "string" },
    passwordPasted: { type: "boolean" },
    score: { type: "number", nullable: true },
  },
};

const createOutput = {
  type: "object",
  properties: {
    sessionId: { type: "string" },
  },
};

export const createRoute = {
  method: "POST",
  url: "/create",
  handler: async (req: any) => {
    const client = await fastify.pg.connect();
    const { body: input } = req;
    console.log({ input });
    try {
      const { rows } = await client.query(
        `insert into sessions(
          TIMESTAMP,
          CUSTOMER_ID,
          TYPING_SPEED,
          CURSOR_HOPS,
          IP,
          PASSWORD_PASTED,
          SCORE
        ) values ($1, $2, $3, $4, $5, $6, $7) returning SESSION_ID`,
        [
          input.timestamp,
          input.customerId,
          input.typingSpeed,
          input.cursorHops,
          input.ip,
          input.passwordPasted,
          input.score ?? null,
        ]
      );
      return rows;
    } finally {
      client.release();
    }
  },
  schema: {
    body: createInput,
    response: {
      200: createOutput,
    },
  },
};
