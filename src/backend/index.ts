import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

app.all("/api/*", (c) => {
  return c.json({ name: "Cloudflare" });
});

export default app satisfies ExportedHandler<Env>;
