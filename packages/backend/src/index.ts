import { zValidator } from "@hono/zod-validator";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { defaultMeta } from "./db/meta";
import * as schema from "./db/schema";

const app = new Hono<{ Bindings: Env }>();

app.use("/api/*", async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (authHeader?.startsWith("Bearer ") !== true) {
    throw new HTTPException(401, { message: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  if (token !== c.env.AUTH_TOKEN) {
    throw new HTTPException(403, { message: "Invalid token" });
  }

  await next();
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const route = app
  .get("/api/v1/config", (c) => {
    return c.json({ github_repo_url: c.env.GITHUB_REPO_URL });
  })
  .post(
    "/api/v1/result",
    zValidator(
      "json",
      z.object({
        duration: z.number().optional(),
        run: z.object({
          commit: z.string(),
          id: z.string(),
          started_at: z.number(),
        }),
        status: z.enum(["failure", "running", "success"]),
        test_name: z.string(),
      }),
    ),
    async (c) => {
      const body = c.req.valid("json");
      const db = drizzle(c.env.DB);

      const revision = crypto.randomUUID();

      await db.batch([
        db
          .insert(schema.meta)
          .values({
            ...defaultMeta,
            revision,
          })
          .onConflictDoUpdate({
            set: { revision },
            target: schema.meta.id,
          }),
        db
          .insert(schema.runs)
          .values({
            commit: body.run.commit,
            id: body.run.id,
            started_at: body.run.started_at,
          })
          .onConflictDoUpdate({
            set: {
              commit: body.run.commit,
              started_at: body.run.started_at,
            },
            target: schema.runs.id,
          }),
        db
          .insert(schema.results)
          .values({
            duration: body.duration,
            run_id: body.run.id,
            status: body.status,
            test_name: body.test_name,
          })
          .onConflictDoUpdate({
            set: {
              duration: body.duration,
              status: body.status,
            },
            target: [schema.results.run_id, schema.results.test_name],
          }),
      ]);

      return c.json({ success: true }, 201);
    },
  )
  .get("/api/v1/run", async (c) => {
    const db = drizzle(c.env.DB);

    const ifNoneMatch = c.req.header("If-None-Match");
    if (ifNoneMatch !== undefined) {
      const [meta] = await db.select().from(schema.meta);
      const revision = (meta ?? defaultMeta).revision;
      if (ifNoneMatch === `W/"${revision}"`) {
        // eslint-disable-next-line unicorn/no-null
        return c.body(null, 304);
      }
    }

    const [[meta], runs, results] = await db.batch([
      db.select().from(schema.meta),
      db.select().from(schema.runs),
      db.select().from(schema.results),
    ]);

    interface RunWithResults {
      commit: string;
      id: string;
      results: Record<
        string,
        Omit<typeof schema.results.$inferSelect, "run_id" | "test_name">
      >;
      started_at: number;
    }

    const runsWithResultsById = new Map<string, RunWithResults>();
    for (const run of runs) {
      runsWithResultsById.set(run.id, { results: {}, ...run });
    }

    for (const result of results) {
      const { run_id, test_name, ...rest } = result;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      runsWithResultsById.get(run_id)!.results[test_name] = rest;
    }

    const runsWithResults = [...runsWithResultsById.values()];
    runsWithResults.sort((a, b) => b.started_at - a.started_at);

    c.header("ETag", `W/"${(meta ?? defaultMeta).revision}"`);
    return c.json(runsWithResults);
  });

export default app satisfies ExportedHandler<Env>;

export type AppType = typeof route;
