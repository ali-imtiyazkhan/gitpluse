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

type Activity = {
  id: string;
  event: string;
  data: any;
  timestamp: string;
};

const LiveActivityFeed = () => {
  const { socket } = useSocket();
  const [activities, setActivities] = useState<Activity[]>([]);

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
      case "TASK_CLAIMED": return <ClipboardCheck className="size-4 text-brand-purple" />;
      case "TASK_STATUS_UPDATED": return <RefreshCw className="size-4 text-brand-purple" />;
      default: return <Zap className="size-4 text-text-tertiary" />;
    }
  };

  const getMessage = (activity: Activity) => {
    const { event, data } = activity;
    switch (event) {
      case "MEMBER_APPLIED": return <span>New application from <b className="text-text-primary">{data.email}</b></span>;
      case "MEMBER_APPROVED": return <span>Member approved: <b className="text-text-primary">{data.email}</b></span>;
      case "PROJECT_CREATED": return <span>New project launched: <b className="text-text-primary">{data.name}</b></span>;
      case "TASK_CLAIMED": return <span><b className="text-text-primary">{data.assigneeName}</b> claimed task "<i className="text-text-tertiary">{data.taskTitle}</i>"</span>;
      case "TASK_STATUS_UPDATED": return <span>Task "<i className="text-text-tertiary">{data.taskTitle}</i>" moved to <b className="text-text-primary">{data.status}</b></span>;
      default: return <span>New activity in the community</span>;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
         <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Zap className="size-5 text-brand-purple fill-brand-purple" />
            Live Activity Feed
         </h3>
         <span className="px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple text-[10px] font-bold uppercase animate-pulse">
            Real-Time
         </span>
      </div>

      <div className="flex flex-col gap-3 min-h-[300px]">
        <AnimatePresence initial={false}>
          {activities.length > 0 ? activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4 rounded-xl bg-dash-surface border border-dash-border hover:border-brand-purple/20 transition-colors flex items-start gap-4"
            >
              <div className="p-2 rounded-lg bg-black/40 border border-dash-border">
                {getIcon(activity.event)}
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <div className="text-sm text-text-secondary leading-snug">
                  {getMessage(activity)}
                </div>
                <div className="text-[10px] text-text-tertiary">
                  {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="flex-grow border border-dashed border-dash-border rounded-2xl flex flex-col items-center justify-center p-12 text-center gap-4">
               <div className="p-4 rounded-full bg-brand-purple/5">
                  <RefreshCw className="size-8 text-dash-border animate-spin-slow" />
               </div>
               <div className="flex flex-col">
                 <span className="text-sm font-medium text-text-muted">Listening for live events...</span>
                 <p className="text-xs text-text-tertiary mt-1 max-w-[200px]">Join a project or claim a task to see real-time updates here.</p>
               </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiveActivityFeed;
