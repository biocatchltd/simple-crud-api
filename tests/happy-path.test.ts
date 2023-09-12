import test, { after, before, describe, it } from "node:test";
import { fastify as server } from "../src/fwInstances";
import assert from "node:assert/strict";

const read = (url: string) =>
  server.inject({
    method: "GET",
    url,
  });

describe("Happy path", async () => {
  before(async () => {
    const ready = await server.ready();
    console.log(ready);
  });
  after(async () => {
    await server.close();
  });

  test("should 404 on an unknown route", async () => {
    const res = await read("/unknown");
    assert.equal(res.statusCode, 404);
  });

  test("should read empty rows", async () => {
    const res = await read("/read");
    assert.equal(res.statusCode, 200);
    assert.equal(JSON.parse(res.body).length, 0);
  });

  test("should create a row", async () => {
    assert.equal(JSON.parse((await read("/read")).body).length, 0);

    const res = await server.inject({
      method: "POST",
      url: "/create",
      payload: {
        timestamp: 123,
        customerId: "test",
        typingSpeed: 0.312,
        cursorHops: 2,
        ip: "9.1.2.3",
        passwordPasted: false,
      },
    });
    assert.equal(res.statusCode, 200);
    assert.equal(JSON.parse((await read("/read")).body).length, 1);
  });

  test("should update a row", async () => {
    const data = JSON.parse((await read("/read")).body);
    assert.equal(data.length, 1);
    assert.equal(data[0].score, 0);

    await server.inject({
      method: "PUT",
      url: "/update",
      payload: {
        sessionId: data[0].sessionId,
        score: 1,
      },
    });

    const updatedData = JSON.parse((await read("/read")).body);
    assert.equal(updatedData.length, 1);
    assert.equal(updatedData[0].score, 1);
  });

  test("should soft-delete a row", async () => {
    const data = JSON.parse((await read("/read")).body);
    assert.equal(data.length, 1);
    assert.equal(data[0].deleted, false);

    await server.inject({
      method: "DELETE",
      url: "/delete",
      payload: {
        sessionId: data[0].sessionId,
      },
    });

    const updatedData = JSON.parse((await read("/read")).body);
    assert.equal(updatedData.length, 1); // it's a soft delete
    assert.equal(updatedData[0].deleted, true);
  });
});
