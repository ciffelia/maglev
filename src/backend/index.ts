import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

app.all("/api/*", (c) => {
  return c.json({ name: "Cloudflare" });
});

app.all("*", (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app satisfies ExportedHandler<Env>;
