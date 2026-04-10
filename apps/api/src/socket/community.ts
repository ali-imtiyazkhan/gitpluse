import { Server, Socket } from "socket.io";

export const setupCommunityHandlers = (io: Server, socket: Socket) => {
  socket.on("community:join", (data: { username: string; communityId: string }) => {
    socket.join(`community:${data.communityId}`);
    
    // Log join event globally
    io.to(`community:${data.communityId}`).emit("community:log", {
      type: "join",
      username: data.username,
      timestamp: new Date(),
    });

    console.log(`👤 ${data.username} joined community ${data.communityId}`);
  });

  socket.on("community:leave", (data: { username: string; communityId: string }) => {
    socket.leave(`community:${data.communityId}`);
    
    // Log leave event
    io.to(`community:${data.communityId}`).emit("community:log", {
      type: "leave",
      username: data.username,
      timestamp: new Date(),
    });

    console.log(`👤 ${data.username} left community ${data.communityId}`);
  });

  socket.on("community:share", (data: { username: string; communityId: string; content: string; title: string }) => {
    const sharedItem = {
      id: Math.random().toString(36).substr(2, 9),
      username: data.username,
      content: data.content,
      title: data.title,
      timestamp: new Date(),
    };

    io.to(`community:${data.communityId}`).emit("community:shared", sharedItem);
    
    // Also add to logs
    io.to(`community:${data.communityId}`).emit("community:log", {
      type: "share",
      username: data.username,
      title: data.title,
      timestamp: new Date(),
    });

    console.log(`📢 ${data.username} shared something in community ${data.communityId}`);
  });
};
