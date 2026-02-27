import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const microfrontends = [
  { name: "mfe1", url: "http://localhost:8081/mf-manifest.json" },
  { name: "mfe2", url: "http://localhost:8082/mf-manifest.json" },
];

const app = new Hono();

app.use(logger());
app.use("/api/*", cors());

app.get("/api/microfrontends", (context) => {
  return context.json(microfrontends);
});

serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`API running on ${info.port}`);
});
