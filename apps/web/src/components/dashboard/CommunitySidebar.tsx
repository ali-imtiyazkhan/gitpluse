"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ChatBubbleLeftRightIcon, 
  UserGroupIcon, 
  HandThumbUpIcon,
  NewspaperIcon,
  GlobeAltIcon,
  XMarkIcon,
  DocumentMagnifyingGlassIcon,
  CommandLineIcon
} from "@heroicons/react/24/outline";
import { useShowSidebar } from "@/store/useShowSidebar";
import { IconWrapper } from "../ui/IconWrapper";

const COMMUNITY_ROUTES = [
  {
    path: "/dashboard/community",
    label: "Explore",
    icon: <GlobeAltIcon className="size-5" />,
  },
  {
    path: "/dashboard/community/discussions",
    label: "Discussions",
    icon: <ChatBubbleLeftRightIcon className="size-5" />,
  },
  {
    path: "/dashboard/community/members",
    label: "Contributors",
    icon: <UserGroupIcon className="size-5" />,
  },
  {
    path: "/dashboard/community/news",
    label: "Announcements",
    icon: <NewspaperIcon className="size-5" />,
  },
  {
    path: "/dashboard/community/analyzer",
    label: "Resume Analyzer",
    icon: <DocumentMagnifyingGlassIcon className="size-5" />,
  },
  {
    path: "/dashboard/community/tasks",
    label: "Available Tasks",
    icon: <CommandLineIcon className="size-5" />,
  },
  {
    path: "/dashboard/community/showcase",
    label: "Showcase",
    icon: <HandThumbUpIcon className="size-5" />,
  },
];

export default function CommunitySidebar({ overlay = false }: { overlay?: boolean }) {
  const { setShowSidebar, isCollapsed, setActiveSidebar } = useShowSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const width = isCollapsed ? 80 : 288;

  return (
    <motion.div
      className={`h-screen flex flex-col bg-dash-surface border-r border-dash-border z-40 ${
        overlay ? "fixed left-0 top-0 bottom-0 xl:hidden" : ""
      }`}
      initial={overlay ? { x: -400, width } : { width }}
      animate={overlay ? { x: 0, width } : { width }}
      exit={overlay ? { x: -400, width } : undefined}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      style={{ width }}
    >
      {/* Header */}
      <div className="flex justify-between items-center h-16 px-4 border-b border-dash-border bg-dash-surface">
        <div className="flex items-center gap-2">
            {!isCollapsed && (
                <span className="text-brand-purple font-bold tracking-tight text-lg">Community</span>
            )}
            {isCollapsed && (
                <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center">
                    <UserGroupIcon className="size-5 text-brand-purple" />
                </div>
            )}
        </div>
        {overlay && (
          <IconWrapper onClick={() => setShowSidebar(false)}>
            <XMarkIcon className="size-5 text-brand-purple" />
          </IconWrapper>
        )}
      </div>

      <div className="sidebar-body flex-grow flex-col overflow-y-auto px-3 py-6 space-y-1">
        <p className={`px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-text-muted transition-opacity ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
          Channels
        </p>
        
        {COMMUNITY_ROUTES.map((route) => {
          const isActive = pathname === route.path || pathname.startsWith(`${route.path}/`);
          return (
            <div
              key={route.path}
              onClick={() => {
                router.push(route.path);
                if (!route.path.includes("community")) {
                  setActiveSidebar("general");
                }
              }}
              className={`w-full h-[40px] flex items-center rounded-lg cursor-pointer transition-all px-3 gap-3 group ${
                isActive
                  ? "bg-brand-purple/10 text-brand-purple"
                  : "text-text-secondary hover:bg-dash-hover hover:text-text-primary"
              }`}
            >
              <span className="shrink-0">{route.icon}</span>
              {!isCollapsed && (
                <span className="text-sm font-medium">{route.label}</span>
              )}
            </div>
          );
        })}

        {!isCollapsed && (
            <div className="mt-8 px-3">
                <div className="p-4 rounded-xl bg-gradient-to-br from-brand-purple/10 to-transparent border border-brand-purple/10">
                    <p className="text-xs font-semibold text-text-primary mb-1">Active Community</p>
                    <p className="text-[10px] text-text-muted leading-relaxed">
                        Join or start a discussion to earn contributor points.
                    </p>
                </div>
            </div>
        )}
      </div>
    </motion.div>
  );
}
