import {
  createExecutionContext,
  env,
  waitOnExecutionContext,
} from "cloudflare:test";
import { hc } from "hono/client";
import { describe, expect, it } from "vitest";

import worker, { type AppType } from ".";

const createClient = (ctx: ExecutionContext) => {
  const fetch: typeof globalThis.fetch = async (input, init) =>
    await worker.request(input, init, env, ctx);
  return hc<AppType>("https://example.com", { fetch });
};

describe("GET /api/ping", () => {
  it("responds with name", async () => {
    const ctx = createExecutionContext();
    const client = createClient(ctx);

    const response = await client.api.ping.$get(undefined, {
      headers: {
        Authorization: `Bearer ${env.MAGREV_TOKEN}`,
      },
    });

    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    expect(await response.json()).toStrictEqual({ name: "Cloudflare" });
  });

  it("responds missing token error", async () => {
    const ctx = createExecutionContext();
    const client = createClient(ctx);

    const response = await client.api.ping.$get();

    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Missing token");
  });

  it("responds invalid token error", async () => {
    const ctx = createExecutionContext();
    const client = createClient(ctx);

    const response = await client.api.ping.$get(undefined, {
      headers: {
        Authorization: `Bearer invalid-token`,
      },
    });

    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(403);
    expect(await response.text()).toBe("Invalid token");
  });
});

describe("POST /api/v1/result", () => {
  const validData = {
    duration: 1000,
    run: {
      commit: "abc123",
      id: "run-123",
      started_at: Date.now(),
    },
    status: "success" as const,
    test_name: "test-1",
  };

  it("creates a new result", async () => {
    const ctx = createExecutionContext();
    const client = createClient(ctx);

    const response = await client.api.v1.result.$post(
      { json: validData },
      {
        headers: {
          Authorization: `Bearer ${env.MAGREV_TOKEN}`,
        },
      },
    );

    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(201);
    expect(await response.json()).toStrictEqual({ success: true });
  });

  it("validates input data", async () => {
    const ctx = createExecutionContext();
    const client = createClient(ctx);

    const invalidData = {
      // Missing required fields
      run: {
        id: "run-123",
      },
      status: "unknown",
    };

    const response = await client.api.v1.result.$post(
      // @ts-expect-error intentionally invalid data
      { json: invalidData },
      {
        headers: {
          Authorization: `Bearer ${env.MAGREV_TOKEN}`,
        },
      },
    );

    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(400);
  });
});

describe("GET /api/v1/run", () => {
  it("returns no runs", async () => {
    const ctx = createExecutionContext();
    const client = createClient(ctx);

    const response = await client.api.v1.run.$get(undefined, {
      headers: {
        Authorization: `Bearer ${env.MAGREV_TOKEN}`,
      },
    });

    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toStrictEqual([]);
  });
});
