"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/providers/socket-provider";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChatBubbleLeftRightIcon, 
  HashtagIcon, 
  PaperAirplaneIcon,
  FaceSmileIcon,
  PhotoIcon,
  MicrophoneIcon,
  ShieldCheckIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

export default function DiscussionsPage() {
  const { data: session } = useSession();
  const { socket, isConnected } = useSocket();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [activeChannel, setActiveChannel] = useState("general");
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const CHANNELS = [
    { id: "general", name: "general", desc: "Main community discussion" },
    { id: "development", name: "development", desc: "Talk shop and code" },
    { id: "showcase", name: "showcase", desc: "Share your latest builds" },
    { id: "help", name: "help-center", desc: "Get help from mentors" },
  ];

  useEffect(() => {
    if (!socket || !isConnected || !session?.user?.name) return;
    const userName = session.user.name;

    // Join the channel
    socket.emit("community:join", {
      username: userName,
      communityId: activeChannel,
    });

    // Handle incoming messages
    socket.on("community:chat_message", (msg: any) => {
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });

    return () => {
      socket.emit("community:leave", {
        username: userName,
        communityId: activeChannel,
      });
      socket.off("community:chat_message");
    };
  }, [socket, isConnected, session, activeChannel]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !session?.user?.name) return;

    socket?.emit("community:chat", {
      username: session.user.name,
      communityId: activeChannel,
      message: chatInput,
    });

    setChatInput("");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-dash-base overflow-hidden">
      {/* Channel Sidebar */}
      <aside className="w-64 border-r border-dash-border bg-dash-surface flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-dash-border">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="size-6 text-brand-purple" />
            Channels
          </h2>
        </div>
        
        <div className="flex-grow p-4 overflow-y-auto space-y-2">
          {CHANNELS.map((channel) => (
            <button
              key={channel.id}
              onClick={() => {
                setActiveChannel(channel.id);
                setMessages([]); // Clear for new channel
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeChannel === channel.id 
                  ? "bg-brand-purple/10 text-brand-purple border border-brand-purple/20 shadow-sm shadow-brand-purple/10" 
                  : "text-text-muted hover:bg-dash-hover hover:text-text-primary"
              }`}
            >
              <HashtagIcon className="size-4 opacity-50" />
              {channel.name}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-dash-border bg-dash-base/30">
           <div className="flex items-center gap-3 p-2">
             <div className="size-8 rounded-full bg-brand-purple flex items-center justify-center text-xs font-bold text-white shadow-xl shadow-brand-purple/20">
                {session?.user?.name?.[0]}
             </div>
             <div className="overflow-hidden">
               <p className="text-xs font-bold text-text-primary truncate">{session?.user?.name}</p>
               <div className="flex items-center gap-1">
                 <div className={`size-1.5 rounded-full ${isConnected ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500"}`} />
                 <p className="text-[10px] text-text-muted">{isConnected ? "Connected" : "Disconnected"}</p>
               </div>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-grow flex flex-col relative">
        {/* Chat Header */}
        <header className="p-4 border-b border-dash-border bg-dash-surface/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-10 w-full">
           <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-dash-hover flex items-center justify-center text-brand-purple border border-dash-border">
                <HashtagIcon className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 uppercase tracking-widest">
                  {CHANNELS.find(c => c.id === activeChannel)?.name}
                </h3>
                <p className="text-[10px] text-text-muted">
                  {CHANNELS.find(c => c.id === activeChannel)?.desc}
                </p>
              </div>
           </div>
           
           <div className="flex items-center gap-2">
              <ShieldCheckIcon className="size-5 text-text-muted" />
              <span className="text-[10px] font-bold text-text-muted uppercase">Safe Community</span>
           </div>
        </header>

        {/* Message Feed */}
        <div className="flex-grow overflow-y-auto p-6 md:p-10 custom-scrollbar bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-purple/5 via-transparent to-transparent">
          <div className="max-w-4xl mx-auto space-y-6">
            <AnimatePresence initial={false}>
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                  <div className="size-20 rounded-full bg-dash-surface border-4 border-brand-purple/10 flex items-center justify-center mb-4">
                     <ChatBubbleLeftRightIcon className="size-10 text-brand-purple/40" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">Start of conversation</h4>
                  <p className="text-sm text-text-muted">Be the first to say something in #{activeChannel}</p>
                </div>
              )}
              {messages.map((msg) => {
                const isMe = msg.username === session?.user?.name;
                const isBot = msg.isBot;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${isMe ? "flex-row-reverse" : ""}`}
                  >
                    {!isMe && (
                      <div className={`size-10 rounded-xl flex-shrink-0 flex items-center justify-center font-bold border ${isBot ? "bg-brand-purple/10 border-brand-purple/30 text-brand-purple shadow-lg shadow-brand-purple/5" : "bg-dash-surface border-dash-border text-text-muted"}`}>
                        {msg.username[0]}
                      </div>
                    )}
                    <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className={`text-[10px] font-bold ${isBot ? "text-brand-purple" : "text-text-muted"}`}>
                          {msg.username} {isBot && (
                            <span className="bg-brand-purple text-white px-1.5 py-0.5 rounded-[4px] text-[8px] font-black tracking-tighter ml-1 uppercase">Pulse AI</span>
                          )}
                        </span>
                        <span className="text-[9px] text-text-muted/50">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all hover:scale-[1.01] ${
                        isMe 
                          ? "bg-brand-purple text-white rounded-tr-none shadow-brand-purple/20" 
                          : isBot 
                            ? "bg-brand-purple/5 border border-brand-purple/20 text-text-primary rounded-tl-none" 
                            : "bg-dash-surface border border-dash-border text-text-primary rounded-tl-none"
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 md:p-10 border-t border-dash-border bg-dash-surface/80 backdrop-blur-xl">
           <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative group">
              <div className="flex items-center gap-2 absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-40 group-focus-within:opacity-100 transition-opacity">
                <PhotoIcon className="size-5 hover:text-brand-purple cursor-pointer transition-colors" />
                <FaceSmileIcon className="size-5 hover:text-brand-purple cursor-pointer transition-colors" />
              </div>
              
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Message #${activeChannel}...`}
                className="w-full bg-dash-base border border-dash-border rounded-2xl pl-20 pr-16 py-5 text-sm outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple shadow-2xl transition-all"
              />

              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                 <button 
                  type="button"
                  className="p-2 rounded-lg text-text-muted hover:text-brand-purple transition-all"
                 >
                   <MicrophoneIcon className="size-5" />
                 </button>
                 <button 
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-3 rounded-xl bg-brand-purple text-white shadow-xl shadow-brand-purple/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
                 >
                   <PaperAirplaneIcon className="size-5" />
                 </button>
              </div>
           </form>
        </div>
      </main>

      {/* Context Sidebar */}
      <aside className="w-80 border-l border-dash-border bg-dash-surface flex flex-col hidden xl:flex">
         <div className="p-8">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-6">Channel Intel</h4>
            
            <div className="p-6 rounded-2xl bg-brand-purple/5 border border-brand-purple/10 border-dashed mb-8">
               <p className="text-xs text-brand-purple font-mono mb-2">PULSE STATUS</p>
               <h5 className="text-2xl font-black text-text-primary mb-1 tracking-tighter">Healthy</h5>
               <p className="text-[10px] text-text-secondary leading-relaxed capitalize">The {activeChannel} channel is humming with activity today.</p>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4">Guidelines</p>
                <ul className="space-y-4">
                  {[
                    { icon: <ShieldCheckIcon />, title: "Stay Respectful", text: "We are a friendly grid." },
                    { icon: <UserCircleIcon />, title: "Collaborate", text: "Help others solve bugs." }
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4 items-start">
                       <div className="size-8 rounded-lg bg-dash-base flex items-center justify-center text-text-muted">
                          {React.cloneElement(item.icon as any, { className: "size-4" })}
                       </div>
                       <div>
                          <p className="text-[11px] font-bold text-text-primary">{item.title}</p>
                          <p className="text-[10px] text-text-muted">{item.text}</p>
                       </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
         </div>
         
         <div className="mt-auto p-8 border-t border-dash-border">
            <button className="w-full py-4 rounded-xl bg-dash-base border border-dash-border text-[10px] font-bold uppercase tracking-widest hover:border-brand-purple/50 transition-all text-text-muted hover:text-text-primary">
               Leave Channel
            </button>
         </div>
      </aside>
    </div>
  );
}
