import express from "express";
import cors from "cors";
import routes from "./routes";
import { env } from "./config/env";

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.use("/api", routes);

export default app;
