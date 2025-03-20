import { zValidator } from "@hono/zod-validator";
import { asc, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import * as schema from "./db/schema";

const app = new Hono<{ Bindings: Env }>();

app.use("/api/*", async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (authHeader?.startsWith("Bearer ") !== true) {
    throw new HTTPException(401, { message: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  if (token !== c.env.MAGREV_TOKEN) {
    throw new HTTPException(403, { message: "Invalid token" });
  }

  await next();
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const route = app
  .get("/api/ping", (c) => {
    return c.json({ name: "Cloudflare" });
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

      await db.batch([
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

    const [runs, results] = await db.batch([
      db.select().from(schema.runs).orderBy(desc(schema.runs.started_at)),
      db
        .select()
        .from(schema.results)
        .orderBy(desc(schema.results.run_id), asc(schema.results.test_name)),
    ]);

    const resultsByRunId = new Map<
      string,
      Omit<typeof schema.results.$inferSelect, "run_id">[]
    >();
    for (const result of results) {
      const { run_id: execution_id, ...rest } = result;
      if (!resultsByRunId.has(execution_id)) {
        resultsByRunId.set(execution_id, []);
      }
      resultsByRunId.get(execution_id)?.push(rest);
    }

    const runsWithResults = runs.map((run) => ({
      ...run,
      results: resultsByRunId.get(run.id) ?? [],
    }));

    return c.json(runsWithResults);
  });

export default app satisfies ExportedHandler<Env>;

export type AppType = typeof route;
