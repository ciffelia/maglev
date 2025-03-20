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

const testAuthErrors = (method: string, url: string) => {
  it("responds missing token error", async () => {
    const ctx = createExecutionContext();

    const response = await worker.request(
      new URL(url, `https://example.com`),
      { method },
      env,
      ctx,
    );

    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Missing token");
  });

  it("responds invalid token error", async () => {
    const ctx = createExecutionContext();

    const response = await worker.request(
      new URL(url, `https://example.com`),
      {
        headers: {
          Authorization: `Bearer invalid-token`,
        },
        method,
      },
      env,
      ctx,
    );

    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(403);
    expect(await response.text()).toBe("Invalid token");
  });
};

const authHeaders = {
  Authorization: `Bearer ${env.MAGREV_TOKEN}`,
};

describe("GET /api/ping", () => {
  it("responds with name", async () => {
    const ctx = createExecutionContext();
    const client = createClient(ctx);

    const response = await client.api.ping.$get(undefined, {
      headers: authHeaders,
    });

    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    expect(await response.json()).toStrictEqual({ name: "Cloudflare" });
  });

  testAuthErrors("GET", "/api/ping");
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
      { headers: authHeaders },
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
      { headers: authHeaders },
    );

    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(400);
  });

  testAuthErrors("POST", "/api/v1/result");
});

describe("GET /api/v1/run", () => {
  it("returns no runs", async () => {
    const ctx = createExecutionContext();
    const client = createClient(ctx);

    const response = await client.api.v1.run.$get(undefined, {
      headers: authHeaders,
    });

    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toStrictEqual([]);
  });

  it("returns created runs", async () => {
    const ctx = createExecutionContext();
    const client = createClient(ctx);

    const validData = [
      {
        duration: 1000,
        run: {
          commit: "abc123",
          id: "run-123",
          started_at: 1_742_397_129 + 86_400,
        },
        status: "success",
        test_name: "test-1",
      },
      {
        duration: 2000,
        run: {
          commit: "def456",
          id: "run-123",
          started_at: 1_742_397_129 + 86_400 * 2,
        },
        status: "failure",
        test_name: "test-2",
      },
      {
        duration: 3000,
        run: {
          commit: "ghi789",
          id: "run-456",
          started_at: 1_742_397_129,
        },
        status: "running",
        test_name: "test-3",
      },
    ] as const;

    for (const data of validData) {
      await client.api.v1.result.$post(
        { json: data },
        { headers: authHeaders },
      );
    }

    const response = await client.api.v1.run.$get(undefined, {
      headers: authHeaders,
    });

    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toStrictEqual([
      {
        commit: "def456",
        id: "run-123",
        results: [
          {
            duration: 1000,
            status: "success",
            test_name: "test-1",
          },
          {
            duration: 2000,
            status: "failure",
            test_name: "test-2",
          },
        ],
        started_at: 1_742_397_129 + 86_400 * 2,
      },
      {
        commit: "ghi789",
        id: "run-456",
        results: [
          {
            duration: 3000,
            status: "running",
            test_name: "test-3",
          },
        ],
        started_at: 1_742_397_129,
      },
    ]);
  });

  testAuthErrors("GET", "/api/v1/run");
});
