"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/providers/socket-provider";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChatBubbleLeftRightIcon, 
  ShareIcon, 
  UserPlusIcon, 
  UserMinusIcon,
  GlobeAltIcon,
  SparklesIcon,
  LinkIcon,
  CommandLineIcon
} from "@heroicons/react/24/outline";
import PrimaryButton from "@/components/ui/custom-button";
import { toast } from "sonner";

interface CommunityLog {
  type: "join" | "leave" | "share";
  username: string;
  title?: string;
  timestamp: Date;
}

interface SharedItem {
  id: string;
  username: string;
  title: string;
  content: string;
  timestamp: Date;
}

export default function CommunityExplorePage() {
  const { data: session } = useSession();
  const { socket, isConnected } = useSocket();
  const [logs, setLogs] = useState<CommunityLog[]>([]);
  const [sharedItems, setSharedItems] = useState<SharedItem[]>([]);
  const [shareTitle, setShareTitle] = useState("");
  const [shareContent, setShareContent] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userName = session?.user?.name;
    if (!socket || !isConnected || !userName) return;

    // Join community room
    socket.emit("community:join", {
      username: userName,
      communityId: "global",
    });

    // Listen for logs
    socket.on("community:log", (log: CommunityLog) => {
      setLogs((prev) => [log, ...prev].slice(0, 50));
    });

    // Listen for shared items
    socket.on("community:shared", (item: SharedItem) => {
      setSharedItems((prev) => [item, ...prev]);
      if (item.username !== userName) {
        toast.info(`New share from ${item.username}`, {
          description: item.title,
        });
      }
    });

    return () => {
      if (userName) {
        socket.emit("community:leave", {
          username: userName,
          communityId: "global",
        });
      }
      socket.off("community:log");
      socket.off("community:shared");
    };
  }, [socket, isConnected, session]);

  const handleShare = () => {
    if (!session?.user?.name) {
      toast.error("You must be logged in to share.");
      return;
    }

    if (!shareTitle || !shareContent) {
      toast.error("Please provide both a title and content.");
      return;
    }

    socket?.emit("community:share", {
      username: session.user.name,
      communityId: "global",
      title: shareTitle,
      content: shareContent,
    });

    setShareTitle("");
    setShareContent("");
    setIsSharing(false);
    toast.success("Content shared with the community!");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-dash-base text-text-primary">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <GlobeAltIcon className="size-8 text-brand-purple" />
            Community Explorer
          </h1>
          <p className="text-text-secondary mt-2">
            Real-time activity and shared resources from the GitPulse community.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                isConnected ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"
            }`}>
                <div className={`size-1.5 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                {isConnected ? "Live Connection" : "Offline"}
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-dash-surface border border-dash-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <SparklesIcon className="size-5 text-brand-purple" />
                Featured Shares
              </h2>
              <PrimaryButton 
                onClick={() => setIsSharing(true)}
                classname="py-2 px-4 text-sm"
              >
                <ShareIcon className="size-4" />
                Share Something
              </PrimaryButton>
            </div>

            <AnimatePresence mode="popLayout">
              {sharedItems.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center space-y-4"
                >
                  <div className="size-16 mx-auto bg-dash-hover rounded-full flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="size-8 text-text-muted" />
                  </div>
                  <p className="text-text-secondary">No shared items yet. Be the first to share!</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sharedItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-5 bg-dash-base border border-dash-border rounded-xl hover:border-brand-purple/30 transition-colors group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                         <LinkIcon className="size-12" />
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="size-6 rounded-full bg-brand-purple/20 flex items-center justify-center text-[10px] font-bold text-brand-purple">
                          {item.username[0].toUpperCase()}
                        </div>
                        <span className="text-xs font-semibold text-text-muted">{item.username}</span>
                        <span className="text-[10px] text-text-muted/50 ml-auto">
                           {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-text-primary mb-2 line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                        {item.content}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* Real-time Logs SidePanel */}
        <div className="space-y-6">
          <section className="bg-dash-surface border border-dash-border rounded-2xl flex flex-col h-[600px] overflow-hidden shadow-sm">
            <div className="p-4 border-b border-dash-border bg-dash-surface/50 backdrop-blur-sm sticky top-0 z-10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                <CommandLineIcon className="size-4" />
                Activity Pulse
              </h2>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
              <AnimatePresence initial={false}>
                {logs.length === 0 && (
                   <p className="text-[10px] text-text-muted text-center py-10">Monitoring network traffic...</p>
                )}
                {logs.map((log, index) => (
                  <motion.div
                    key={`${log.timestamp.toString()}-${index}`}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-start gap-3 text-[11px] font-mono leading-tight bg-dash-base/50 p-2 rounded-lg border border-dash-border/50"
                  >
                    <span className="text-text-muted/40 shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    
                    {log.type === "join" && (
                      <span className="text-green-400">
                        <UserPlusIcon className="size-3 inline mr-1" />
                        <span className="font-bold">{log.username}</span> connected to the grid.
                      </span>
                    )}
                    
                    {log.type === "leave" && (
                      <span className="text-red-400">
                        <UserMinusIcon className="size-3 inline mr-1" />
                        <span className="font-bold">{log.username}</span> dropped the connection.
                      </span>
                    )}
                    
                    {log.type === "share" && (
                      <span className="text-blue-400">
                        <ShareIcon className="size-3 inline mr-1" />
                        <span className="font-bold">{log.username}</span> shared <span className="underline italic">"{log.title}"</span>
                      </span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={logEndRef} />
            </div>
          </section>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {isSharing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSharing(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-lg bg-dash-surface border border-dash-border rounded-3xl p-8 z-10 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-text-primary">
                <div className="size-10 rounded-2xl bg-brand-purple/20 flex items-center justify-center">
                  <ShareIcon className="size-6 text-brand-purple" />
                </div>
                Share with the Grid
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest px-1">Concept Title</label>
                  <input 
                    type="text" 
                    value={shareTitle}
                    onChange={(e) => setShareTitle(e.target.value)}
                    placeholder="E.g., New AI Model Architecture"
                    className="w-full bg-dash-base border border-dash-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-purple/50 outline-none transition-all placeholder:text-text-muted/30"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest px-1">Intel Details</label>
                  <textarea 
                    rows={4}
                    value={shareContent}
                    onChange={(e) => setShareContent(e.target.value)}
                    placeholder="Describe what you're sharing with the community..."
                    className="w-full bg-dash-base border border-dash-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-purple/50 outline-none transition-all resize-none placeholder:text-text-muted/30"
                  />
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={() => setIsSharing(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-dash-border text-sm font-semibold hover:bg-dash-hover transition-colors"
                  >
                    Cancel
                  </button>
                  <PrimaryButton 
                    onClick={handleShare}
                    classname="flex-[2] py-3 rounded-xl font-bold"
                  >
                    Broadcast Pulse
                  </PrimaryButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
