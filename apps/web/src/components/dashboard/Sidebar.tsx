"use client";

import React, { useState } from "react";
import Link from "next/link";
import SidebarItem from "../sidebar/SidebarItem";
import { useRouter, usePathname } from "next/navigation";
import { IconWrapper } from "../ui/IconWrapper";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  HomeIcon,
  FolderIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  SparklesIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  CommandLineIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useShowSidebar } from "@/store/useShowSidebar";
import { signOut, useSession } from "next-auth/react";
import { ProfilePic } from "./ProfilePic";
import { ChevronLeftIcon, ChevronRightIcon, KeyRound } from "lucide-react";

type RouteConfig = {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  adminOnly?: boolean;
};

const MAIN_ROUTES: RouteConfig[] = [
  {
    path: "/dashboard/home",
    label: "Dashboard",
    icon: <HomeIcon className="size-5" />,
  },
  {
    path: "/dashboard/projects",
    label: "Projects",
    icon: <FolderIcon className="size-5" />,
  },
  {
    path: "/dashboard/community",
    label: "Community",
    icon: <GlobeAltIcon className="size-5" />,
    badge: "Live",
  },
  {
    path: "/dashboard/community/analyzer",
    label: "AI Insights",
    icon: <SparklesIcon className="size-5" />,
  },
];

const ADMIN_ROUTES: RouteConfig[] = [
  {
    path: "/dashboard/members",
    label: "Member Hub",
    icon: <UserGroupIcon className="size-5" />,
  },
  {
    path: "/dashboard/admin",
    label: "Admin Control",
    icon: <ShieldCheckIcon className="size-5" />,
    badge: "System",
  },
];

export default function Sidebar({ overlay = false }: { overlay?: boolean }) {
  const { setShowSidebar, isCollapsed, toggleCollapsed, setActiveSidebar } = useShowSidebar();
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === "OWNER" || userRole === "MAINTAINER";

  const reqFeatureHandler = () => {
    window.open("https://github.com/ali-imtiyazkhan/gitpluse/issues", "_blank");
  };

  const desktopWidth = isCollapsed ? 80 : 288;
  const mobileWidth = desktopWidth;

  const renderRoute = (route: RouteConfig) => {
    const isActive = pathname === route.path || pathname.startsWith(`${route.path}/`);
    return (
      <div
        key={route.path}
        onClick={() => {
          router.push(route.path);
          if (route.path.includes("community")) {
            setActiveSidebar("community");
          }
        }}
        className={`w-full h-[44px] flex items-center rounded-md cursor-pointer transition-all duration-200 px-2 gap-3 pl-3 group ${
          isActive
            ? "bg-brand-purple/10 border-l-2 border-brand-purple shadow-[0_0_15px_-5px_rgba(168,85,247,0.4)]"
            : "hover:bg-dash-hover"
        }`}
      >
        <span
          className={`shrink-0 transition-colors ${
            isActive
              ? "text-brand-purple"
              : "text-text-secondary group-hover:text-text-primary"
          }`}
        >
          {route.icon}
        </span>
        {!isCollapsed && (
          <div className="flex items-center justify-between flex-1 min-w-0">
            <h1
              className={`text-xs font-medium transition-colors ${
                isActive
                  ? "text-text-primary"
                  : "text-text-tertiary group-hover:text-text-primary"
              }`}
            >
              {route.label}
            </h1>
            {route.badge && (
              <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest bg-brand-purple/20 text-text-primary rounded-full border border-brand-purple/30 mr-1">
                {route.badge}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      className={`h-screen flex flex-col bg-dash-surface border-r border-dash-border z-50 ${
        overlay ? "fixed left-0 top-0 bottom-0 xl:hidden" : ""
      }`}
      initial={
        overlay ? { x: -400, width: mobileWidth } : { width: desktopWidth }
      }
      animate={overlay ? { x: 0, width: mobileWidth } : { width: desktopWidth }}
      exit={overlay ? { x: -400, width: mobileWidth } : undefined}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      style={{ width: overlay ? mobileWidth : desktopWidth }}
    >
      {/* Mobile header */}
      <div className="flex justify-between items-center h-16 px-4 border-b border-dash-border xl:hidden bg-dash-surface">
        <div className="flex items-center">
          <span
            onClick={() => router.push("/")}
            className="text-xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent cursor-pointer"
          >
            OpenSox
          </span>
        </div>
        <IconWrapper onClick={() => setShowSidebar(false)}>
          <XMarkIcon className="size-5 text-brand-purple" />
        </IconWrapper>
      </div>

      {/* Desktop header with collapse */}
      <div className="hidden xl:flex items-center justify-between px-4 py-4 border-b border-dash-border bg-dash-surface">
        {!isCollapsed && (
          <span
            onClick={() => router.push("/")}
            className="text-text-primary font-bold tracking-tight select-none text-xl hover:text-brand-purple transition-all duration-300 cursor-pointer"
          >
            OpenSox
          </span>
        )}
        <IconWrapper
          onClick={toggleCollapsed}
          className={isCollapsed ? "w-full flex justify-center" : ""}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="size-5 text-brand-purple" />
          ) : (
            <ChevronLeftIcon className="size-5 text-brand-purple" />
          )}
        </IconWrapper>
      </div>

      <div className="sidebar-body flex-grow flex-col overflow-y-auto px-3 py-6 space-y-6">
        {/* Main Routes */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-3 pb-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">General</p>
          )}
          {MAIN_ROUTES.map(renderRoute)}
        </div>

        {/* Admin Routes */}
        {isAdmin && (
          <div className="space-y-1 pt-4 border-t border-dash-border/30">
            {!isCollapsed && (
              <p className="px-3 pb-2 text-[10px] font-bold text-brand-purple uppercase tracking-widest flex items-center gap-2">
                <ShieldCheckIcon className="size-3" /> Admin Area
              </p>
            )}
            {ADMIN_ROUTES.map(renderRoute)}
          </div>
        )}

        {/* Utility Features */}
        <div className="pt-4 border-t border-dash-border/30">
          <SidebarItem
            itemName="Request a feature"
            onclick={reqFeatureHandler}
            icon={<SparklesIcon className="size-5" />}
            collapsed={isCollapsed}
          />
        </div>
      </div>

      {/* Bottom profile */}
      <ProfileMenu isCollapsed={isCollapsed} isAdmin={isAdmin} />
    </motion.div>
  );
}

function ProfileMenu({ isCollapsed, isAdmin }: { isCollapsed: boolean, isAdmin: boolean }) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const isLoggedIn = !!session;
  const fullName = session?.user?.name || "User";
  const firstName = fullName.split(" ")[0];
  const userEmail = session?.user?.email || "";
  const userImage = session?.user?.image || null;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (open && !target.closest(".profile-menu-container")) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div className="px-3 py-4 border-t border-dash-border bg-dash-surface relative profile-menu-container">
      <div
        className={`group flex items-center rounded-xl bg-ox-profile-card border border-dash-border p-2 transition-all duration-300 ease-out cursor-pointer hover:border-brand-purple/30 ${
          isCollapsed ? "justify-center" : "gap-3"
        }`}
        onClick={() => setOpen((s) => !s)}
      >
        <ProfilePic imageUrl={userImage} />
        {!isCollapsed && (
          <div className="flex-1 flex items-center justify-between min-w-0">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-text-primary font-semibold truncate">
                  {isLoggedIn ? firstName : "Guest"}
                </span>
                {isAdmin && (
                  <KeyRound className="size-3 text-brand-purple" />
                )}
              </div>
              <span className="text-[10px] text-text-muted truncate">
                {isLoggedIn ? userEmail : "Not signed in"}
              </span>
            </div>
            <ChevronLeftIcon
              className={`size-4 text-text-muted transition-transform duration-300 ${open ? "rotate-90" : "-rotate-90"}`}
            />
          </div>
        )}
      </div>
      <AnimatePresence>
        {!isCollapsed && open && (
          <motion.div
            key="profile-dropdown"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full left-3 right-3 mb-3 bg-dash-surface border border-dash-border rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl bg-opacity-90"
          >
            <div className="p-4 border-b border-dash-border bg-brand-purple/5">
              <div className="flex items-center gap-3">
                <ProfilePic imageUrl={userImage} />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-text-primary font-bold truncate">
                      {isLoggedIn ? fullName : "Guest"}
                    </span>
                    {isAdmin && (
                       <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest bg-brand-purple text-text-primary rounded border border-brand-purple/30 shadow-sm">
                        Admin
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-text-muted truncate">
                    {isLoggedIn ? userEmail : "Not signed in"}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-1">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold text-text-secondary hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <ArrowRightOnRectangleIcon className="size-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    router.push("/login");
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold text-text-secondary hover:text-brand-purple hover:bg-brand-purple/10 rounded-lg transition-all"
                >
                  <ArrowLeftOnRectangleIcon className="size-4" />
                  <span>Join Community</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
