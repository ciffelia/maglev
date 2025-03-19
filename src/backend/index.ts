import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/ping", (c) => {
  return c.json({ name: "Cloudflare" });
});

export default app satisfies ExportedHandler<Env>;
