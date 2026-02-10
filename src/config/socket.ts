import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { env } from "./env";

export const attachSocket = (server: HttpServer): Server => {
  const io = new Server(server, {
    cors: {
      origin: env.corsOrigin,
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    socket.emit("status", { ok: true });
  });

  return io;
};
