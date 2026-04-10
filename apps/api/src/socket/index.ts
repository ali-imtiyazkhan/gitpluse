import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

import { setupCommunityHandlers } from "./community.js";

let io: SocketIOServer;

export const initSocket = (server: HTTPServer, origins: string[]) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: origins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Register community handlers
    setupCommunityHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

/**
 * Emit a global activity event
 */
export const emitActivity = (event: string, data: any) => {
  if (io) {
    io.emit("activity", { event, data, timestamp: new Date() });
    console.log(`📡 Emitted activity: ${event}`);
  }
};
