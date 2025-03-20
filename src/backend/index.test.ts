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

describe("/api/ping", () => {
  it("responds with name", async () => {
    const ctx = createExecutionContext();
    const client = createClient(ctx);

    const response = await client.api.ping.$get(undefined, {
      headers: {
        Authorization: `Bearer ${env.MAGREV_TOKEN}`,
      },
    });

    await waitOnExecutionContext(ctx);

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
