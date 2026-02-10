import http from "http";
import app from "./app";
import { env } from "./config/env";
import { attachSocket } from "./config/socket";
import { connectRedis } from "./config/redis";
import { connectDb } from "./config/db";

const server = http.createServer(app);

attachSocket(server);

const start = async (): Promise<void> => {
  await connectDb();
  await connectRedis();

  server.listen(env.port, () => {
    console.log(`Server listening on port ${env.port}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
