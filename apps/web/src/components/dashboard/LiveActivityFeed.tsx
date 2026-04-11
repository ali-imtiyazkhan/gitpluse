"use client";

import React, { useEffect, useState } from "react";
import { useSocket } from "@/providers/socket-provider";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus, 
  CheckCircle, 
  Trash2, 
  Layout, 
  ClipboardCheck, 
  RefreshCw,
  Zap
} from "lucide-react";
import { trpc } from "@/lib/trpc";

type Activity = {
  id: string;
  event: string;
  data: any;
  timestamp: string;
};

const LiveActivityFeed = () => {
  const { socket } = useSocket();
  const [activities, setActivities] = useState<Activity[]>([]);

  // Fetch initial history
  const { data: history, isLoading } = trpc.member.getRecentActivities.useQuery();

  useEffect(() => {
    if (history) {
      const mappedHistory: Activity[] = history.map(log => ({
        id: log.id,
        event: log.action,
        data: typeof log.details === 'string' ? JSON.parse(log.details) : log.details || {},
        timestamp: log.createdAt.toString()
      }));
      setActivities(mappedHistory);
    }
  }, [history]);

  useEffect(() => {
    if (!socket) return;

    const handleActivity = (payload: { event: string; data: any; timestamp: string }) => {
      const newActivity: Activity = {
        id: Math.random().toString(36).substring(7),
        ...payload,
      };
      
      setActivities((prev) => [newActivity, ...prev].slice(0, 10)); // Keep last 10
    };

    socket.on("activity", handleActivity);

    return () => {
      socket.off("activity", handleActivity);
    };
  }, [socket]);

  const getIcon = (event: string) => {
    switch (event) {
      case "MEMBER_APPLIED": return <UserPlus className="size-4 text-yellow-500" />;
      case "MEMBER_APPROVED": return <CheckCircle className="size-4 text-green-500" />;
      case "MEMBER_BANNED": return <Trash2 className="size-4 text-red-500" />;
      case "PROJECT_CREATED": return <Layout className="size-4 text-brand-purple" />;
      case "TASK_CREATED": return <Zap className="size-4 text-brand-purple" />;
      case "TASK_CLAIMED": 
      case "ROLE_UPDATED": return <ClipboardCheck className="size-4 text-emerald-400" />;
      case "TASK_STATUS_UPDATED": return <RefreshCw className="size-4 text-brand-purple" />;
      default: return <Zap className="size-4 text-text-tertiary" />;
    }
  };

  const getMessage = (activity: Activity) => {
    const { event, data } = activity;
    const details = data || {};
    
    switch (event) {
      case "MEMBER_APPLIED": return <span>New application from <b className="text-text-primary">{details.email}</b></span>;
      case "MEMBER_APPROVED": return <span>Member approved: <b className="text-text-primary">{details.email}</b></span>;
      case "ROLE_UPDATED": return <span>Role elevated: <b className="text-text-primary">{details.memberEmail}</b> is now <b className="text-brand-purple uppercase">{details.newRole}</b></span>;
      case "PROJECT_CREATED": return <span>New project launched: <b className="text-text-primary">{details.name}</b></span>;
      case "TASK_CLAIMED": return <span><b className="text-text-primary">{details.assigneeName || 'A contributor'}</b> claimed task "<i className="text-text-tertiary">{details.taskTitle || 'a resource'}</i>"</span>;
      case "TASK_STATUS_UPDATED": return <span>Task moved to <b className="text-text-primary">{details.status}</b></span>;
      default: return <span>New activity in the community grid</span>;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
         <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Zap className="size-5 text-brand-purple fill-brand-purple" />
            Grid Activity Feed
         </h3>
         <span className="px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple text-[10px] font-bold uppercase animate-pulse">
            Live
         </span>
      </div>

      <div className="flex flex-col gap-3 min-h-[300px]">
        {isLoading && (
           <div className="flex-grow flex items-center justify-center p-12">
              <RefreshCw className="size-6 text-brand-purple animate-spin" />
           </div>
        )}

        <AnimatePresence initial={false}>
          {activities.length > 0 ? activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl bg-dash-surface border border-dash-border hover:border-brand-purple/20 transition-all group flex items-start gap-4"
            >
              <div className="p-2 rounded-lg bg-black/40 border border-dash-border group-hover:bg-brand-purple/5 transition-colors">
                {getIcon(activity.event)}
              </div>
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="text-sm text-text-secondary leading-snug truncate group-hover:text-text-primary transition-colors">
                  {getMessage(activity)}
                </div>
                <div className="text-[10px] text-text-tertiary font-mono">
                  {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          )) : !isLoading && (
            <div className="flex-grow border border-dashed border-dash-border rounded-2xl flex flex-col items-center justify-center p-12 text-center gap-4">
               <div className="p-4 rounded-full bg-brand-purple/5">
                  <RefreshCw className="size-8 text-dash-border" />
               </div>
               <div className="flex flex-col">
                 <span className="text-sm font-medium text-text-muted">Waiting for grid pulse...</span>
               </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiveActivityFeed;
