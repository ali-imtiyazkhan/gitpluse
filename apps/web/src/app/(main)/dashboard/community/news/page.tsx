"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MegaphoneIcon, 
  NewspaperIcon, 
  SparklesIcon, 
  CalendarIcon, 
  ShieldCheckIcon,
  TagIcon,
  ClockIcon,
  ArrowRightIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";

type AnnouncementType = "update" | "event" | "security" | "important";

interface Announcement {
  id: string;
  type: AnnouncementType;
  title: string;
  content: string;
  date: string;
  author: string;
  pinned?: boolean;
}

const SAMPLE_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    type: "important",
    title: "HackTheChain 4.0 Begins!",
    content: "The official hackathon period has started. Ensure your project repository is linked to GitPulse for automatic contribution tracking and point accumulation.",
    date: "April 11, 2026",
    author: "Core Team",
    pinned: true,
  },
  {
    id: "2",
    type: "update",
    title: "AI Analysis Engine v2.1 Released",
    content: "We've upgraded our skill extraction model. You can now upload PDF resumes directly, and our engine will categorize your tech stack with 95% higher precision.",
    date: "April 10, 2026",
    author: "Dev Lead",
  },
  {
    id: "3",
    type: "event",
    title: "Community Q&A - Live on Discord",
    content: "Join us tomorrow at 6 PM UTC for a live session with top maintainers. We'll be discussing the future of OpenSox and rewarding active contributors.",
    date: "April 9, 2026",
    author: "Community Manager",
  },
  {
    id: "4",
    type: "security",
    title: "Scheduled Maintenance: Prisma Migration",
    content: "Our database will undergo brief maintenance on Sunday morning. Expected downtime is less than 5 minutes while we optimize project indexing.",
    date: "April 8, 2026",
    author: "Systems",
  }
];

const CATEGORIES: { id: AnnouncementType | "all"; label: string; icon: any }[] = [
  { id: "all", label: "All News", icon: NewspaperIcon },
  { id: "update", label: "Updates", icon: SparklesIcon },
  { id: "event", label: "Events", icon: CalendarIcon },
  { id: "security", label: "Security", icon: ShieldCheckIcon },
];

export default function AnnouncementsPage() {
  const [filter, setFilter] = useState<AnnouncementType | "all">("all");

  const filteredAnnouncements = SAMPLE_ANNOUNCEMENTS.filter(a => 
    filter === "all" || a.type === filter
  );

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen bg-dash-base">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="size-10 rounded-2xl bg-brand-purple/20 flex items-center justify-center">
            <MegaphoneIcon className="size-6 text-brand-purple" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Official Pulse</h1>
        </div>
        <p className="text-text-secondary">
          Stay updated with the latest news, releases, and ecosystem events.
        </p>
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
              filter === cat.id 
                ? "bg-brand-purple text-white border-brand-purple shadow-lg shadow-brand-purple/20" 
                : "bg-dash-surface text-text-muted border-dash-border hover:border-text-muted/30"
            }`}
          >
            <cat.icon className="size-4" />
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredAnnouncements.map((item, index) => (
            <AnnouncementCard key={item.id} item={item} index={index} />
          ))}
          
          {filteredAnnouncements.length === 0 && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="py-20 text-center bg-dash-surface/30 rounded-3xl border border-dashed border-dash-border"
            >
              <InformationCircleIcon className="size-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary italic">No announcements found in this category.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AnnouncementCard({ item, index }: { item: Announcement; index: number }) {
  const getColors = (type: AnnouncementType) => {
    switch (type) {
      case "important": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "update": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "event": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "security": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default: return "bg-dash-base text-text-muted border-dash-border";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative p-8 rounded-3xl bg-dash-surface border border-dash-border transition-all duration-300 hover:border-brand-purple/30 ${item.pinned ? "shadow-[0_0_40px_rgba(85,25,247,0.05)] border-brand-purple/20" : ""}`}
    >
      {item.pinned && (
        <div className="absolute top-0 right-10 -translate-y-1/2 px-3 py-1 rounded-full bg-brand-purple text-white text-[8px] font-black uppercase tracking-widest shadow-lg">
          Pinned Announcement
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-grow space-y-4">
          <div className="flex items-center gap-3">
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter border ${getColors(item.type)}`}>
              {item.type}
            </span>
            <div className="flex items-center gap-1.5 text-text-muted">
              <ClockIcon className="size-3.5" />
              <span className="text-[11px] font-medium">{item.date}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-text-primary group-hover:text-brand-purple transition-colors">
            {item.title}
          </h3>
          
          <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
            {item.content}
          </p>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-dash-hover flex items-center justify-center">
                <TagIcon className="size-3 text-text-muted" />
              </div>
              <span className="text-xs text-text-muted font-medium">{item.author}</span>
            </div>
          </div>
        </div>

        <button className="self-end md:self-center p-3 rounded-2xl bg-dash-base border border-dash-border text-text-muted hover:text-brand-purple hover:border-brand-purple/30 transition-all group/btn">
            <ArrowRightIcon className="size-5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
