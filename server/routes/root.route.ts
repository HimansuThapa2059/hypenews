import { Hono } from "hono";

const rootRouter = new Hono().get("/", (c) =>
  c.text("Hey there 👋! Welcome to hono api for HypeNews")
);

export default rootRouter;
export type RootRoutes = typeof rootRouter;
