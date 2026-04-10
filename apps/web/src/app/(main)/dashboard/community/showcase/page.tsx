"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  StarIcon, 
  RocketLaunchIcon, 
  HeartIcon, 
  CodeBracketIcon,
  UserGroupIcon,
  ArrowRightIcon,
  TrophyIcon,
  FireIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/ui/custom-button";

interface ShowcaseProject {
  id: string;
  title: string;
  description: string;
  stars: number;
  contributors: number;
  tags: string[];
  image: string;
  author: {
    name: string;
    avatar: string;
  };
}

const FEATURED_PROJECTS: ShowcaseProject[] = [
  {
    id: "1",
    title: "NeuroGrid AI",
    description: "A decentralized neural network framework optimized for edge computing and real-time inference on consumer hardware.",
    stars: 1240,
    contributors: 42,
    tags: ["Rust", "PyTorch", "Wasm"],
    image: "/assets/showcase1.webp", // Placeholder naming
    author: { name: "Ajeet Singh", avatar: "A" }
  },
  {
    id: "2",
    title: "FluxUI Component Kit",
    description: "An ultra-performant, accessible component library built for high-refresh rate interfaces and fluid motion.",
    stars: 850,
    contributors: 18,
    tags: ["React", "Framer Motion", "Tailwind"],
    image: "/assets/showcase2.webp",
    author: { name: "Imtiyaz Khan", avatar: "I" }
  },
  {
    id: "3",
    title: "PrismDB Core",
    description: "A high-performance columnar database engine designed for extreme scalability and sub-second analytical queries.",
    stars: 560,
    contributors: 12,
    tags: ["Go", "C++", "GRPC"],
    image: "/assets/showcase3.webp",
    author: { name: "Bilal", avatar: "B" }
  }
];

export default function ShowcasePage() {
  const router = useRouter();

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-dash-base text-text-primary">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-4">
            <RocketLaunchIcon className="size-10 text-brand-purple" />
            Pulse Showcase
          </h1>
          <p className="text-text-secondary mt-2 text-lg">
            Celebrating the elite builders and high-impact projects of the GitPulse ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-dash-surface border border-dash-border p-2 rounded-2xl">
          <div className="px-4 py-2 border-r border-dash-border text-center">
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Total Likes</p>
            <p className="text-xl font-black text-brand-purple">24.5k</p>
          </div>
          <div className="px-4 py-2 text-center">
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Global PRs</p>
            <p className="text-xl font-black text-brand-purple">1.2k</p>
          </div>
        </div>
      </header>

      {/* Hero Showcase */}
      <section className="mb-16 relative group cursor-pointer" onClick={() => router.push("/dashboard/projects/1")}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 rounded-3xl" />
        <div className="h-[400px] w-full relative overflow-hidden rounded-3xl border border-white/5">
          <Image 
            src="/assets/featured_project_mockup_1775862611068.png" // Using the generated image
            alt="Featured Project"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        
        <div className="absolute bottom-0 left-0 p-10 z-20 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-brand-purple text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-brand-purple/40">
                  Featured Pulse
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                  <TrophyIcon className="size-4" /> Maintainers Choice 2026
                </span>
             </div>
             <h2 className="text-5xl font-black tracking-tighter">NeuroGrid OS</h2>
             <p className="text-gray-300 max-w-xl text-lg leading-relaxed font-medium">
               The next generation of distributed operating systems, built entirely by the GitPulse community in less than 90 days.
             </p>
          </div>
          <PrimaryButton classname="py-4 px-8 text-lg font-bold">
            Explore Repository <ArrowRightIcon className="size-5" />
          </PrimaryButton>
        </div>
      </section>

      {/* Project Grid */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <FireIcon className="size-6 text-brand-purple" />
          Trending Innovations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_PROJECTS.map((project, index) => (
            <ShowcaseCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>

      {/* Contributor Spotlight */}
      <section className="bg-dash-surface border border-dash-border rounded-[40px] p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-purple/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="size-32 rounded-full bg-gradient-to-br from-brand-purple to-cyan-400 p-1 flex-shrink-0">
             <div className="w-full h-full rounded-full bg-dash-surface flex items-center justify-center text-4xl font-black text-brand-purple border-4 border-dash-base shadow-2xl">
                AS
             </div>
          </div>
          <div>
            <p className="text-brand-purple font-mono text-sm tracking-widest uppercase mb-2">CONTRIBUTOR SPOTLIGHT</p>
            <h3 className="text-4xl font-black text-text-primary mb-4 tracking-tighter">Ajeet Singh</h3>
            <p className="text-text-secondary text-lg leading-relaxed max-w-2xl italic">
              "By leveraging the Pulse Matching algorithm, I was able to find three core projects that perfectly fit my Rust experience. We shipped NeuroGrid's core module in record time."
            </p>
            <div className="flex gap-6 mt-6">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-text-primary">240+</span>
                <span className="text-xs text-text-muted uppercase font-bold tracking-widest">Total Merges</span>
              </div>
              <div className="flex flex-col border-l border-dash-border pl-6">
                <span className="text-2xl font-bold text-text-primary">12</span>
                <span className="text-xs text-text-muted uppercase font-bold tracking-widest">Active Mentorships</span>
              </div>
            </div>
          </div>
          <div className="md:ml-auto">
             <button className="px-6 py-3 rounded-xl border border-brand-purple/30 text-brand-purple font-bold hover:bg-brand-purple hover:text-white transition-all shadow-lg shadow-brand-purple/5">
               View Full Profile
             </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ShowcaseCard({ project, index }: { project: ShowcaseProject; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-dash-surface border border-dash-border rounded-3xl overflow-hidden hover:border-brand-purple/30 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-purple/5"
    >
      <div className="h-48 bg-dash-base relative overflow-hidden flex items-center justify-center">
         <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
         <CodeBracketIcon className="size-16 text-text-muted/20 group-hover:text-brand-purple/20 transition-all duration-500 group-hover:scale-110" />
      </div>
      <div className="p-8 space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex gap-1">
             {[1,2,3,4,5].map(i => <StarIconSolid key={i} className="size-3 text-amber-500" />)}
           </div>
           <div className="flex items-center gap-1 text-text-muted text-xs">
              <UserGroupIcon className="size-4" /> {project.contributors}
           </div>
        </div>
        <h4 className="text-xl font-bold text-text-primary group-hover:text-brand-purple transition-colors">{project.title}</h4>
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
           {project.tags.map(tag => (
             <span key={tag} className="px-2 py-0.5 rounded-lg bg-dash-base border border-dash-border text-[10px] font-bold text-text-muted">
               {tag}
             </span>
           ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-dash-border">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-full bg-brand-purple/20 text-brand-purple flex items-center justify-center text-[10px] font-bold">
              {project.author.avatar}
            </div>
            <span className="text-[11px] font-medium text-text-muted">{project.author.name}</span>
          </div>
          <button className="text-text-muted hover:text-brand-purple transition-all transform hover:translate-x-1">
            <ArrowRightIcon className="size-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
