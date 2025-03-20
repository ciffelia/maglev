import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";

import * as schema from "./db/schema";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/ping", (c) => {
  return c.json({ name: "Cloudflare" });
});

app.get("/api/user", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(schema.users).all();
  return c.json(result);
});

app.post("/api/user", async (c) => {
  const params = await c.req.json<typeof schema.users.$inferSelect>();
  const db = drizzle(c.env.DB);

  const result = await db.insert(schema.users).values({
    name: params.name,
  });

  return c.json(result);
});

export default app satisfies ExportedHandler<Env>;
