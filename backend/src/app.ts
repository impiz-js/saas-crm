import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { config } from "./config.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api", routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
