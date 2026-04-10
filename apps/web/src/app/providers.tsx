"use client";

import React from "react";
import { SocketProvider } from "@/providers/socket-provider";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
      <Toaster position="top-right" richColors closeButton />
      {children}
    </SocketProvider>
  );
}
