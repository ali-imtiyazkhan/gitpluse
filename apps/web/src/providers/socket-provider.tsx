"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080", {
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log("🔌 Connected to Socket.io");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("🔌 Disconnected from Socket.io");
      setIsConnected(false);
    });

    // Global activity listener for real-time notifications
    socketInstance.on("activity", (data: { event: string; data: any }) => {
      console.log("📡 Activity received:", data);
      
      // Show elegant toast for specific events
      switch (data.event) {
        case "TASK_CLAIMED":
          toast.success(`Task Claimed!`, {
            description: `${data.data.assigneeName} claimed task: ${data.data.taskTitle}`,
          });
          break;
        case "MEMBER_APPROVED":
          toast.info(`New Member!`, {
            description: `A new member has been approved to join the community.`,
          });
          break;
        case "PROJECT_CREATED":
          toast.success(`New Project!`, {
            description: `Project "${data.data.name}" was just launched.`,
          });
          break;
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
