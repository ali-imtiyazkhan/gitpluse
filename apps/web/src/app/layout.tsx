import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth/config";
import { SessionWrapper } from "./SessionWrapper";
import { TRPCProvider } from "@/providers/trpc-provider";
import { SocketProvider } from "@/providers/socket-provider";
import { GeistSans } from "geist/font/sans";

// DM Mono - Used for code, terminal, and monospace text
const dmMono = localFont({
  src: [
    {
      path: "./fonts/DMMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/DMMono-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-dm-mono",
  display: "optional",
  preload: true,
});

// Geist Sans - Primary font for body text and UI
const geistSans = GeistSans;

export const metadata: Metadata = {
  title: "GitPulse - The heartbeat of open source contribution",
  description: "Manage contributors, projects and tasks with kanamycin precision.",
  icons: {
    icon: "/images/os-image.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authConfig);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} ${dmMono.variable} antialiased bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionWrapper session={session}>
            <TRPCProvider>
              <SocketProvider>
                {children}
              </SocketProvider>
            </TRPCProvider>
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
