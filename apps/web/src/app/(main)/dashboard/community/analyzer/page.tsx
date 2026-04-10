"use client";

import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import PrimaryButton from "@/components/ui/custom-button";
import { 
  DocumentTextIcon, 
  SparklesIcon, 
  CheckCircleIcon,
  CpuChipIcon,
  CodeBracketIcon,
  WrenchScrewdriverIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumeAnalyzerPage() {
  const [text, setText] = useState("");
  const [results, setResults] = useState<any>(null);

  const mutation = trpc.member.analyzeSkills.useMutation({
    onSuccess: (data) => {
      setResults(data);
      toast.success("Analysis complete!", {
        description: "We've identified several key skills from your text.",
      });
    },
    onError: (err) => {
      toast.error("Analysis failed", {
        description: err.message,
      });
    },
  });

  const handleAnalyze = () => {
    if (!text.trim()) {
      toast.error("Please paste your resume or bio first.");
      return;
    }
    mutation.mutate({ text });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen bg-dash-base">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
          <SparklesIcon className="size-8 text-brand-purple" />
          Resume Analyzer
        </h1>
        <p className="text-text-secondary mt-2">
          Paste your resume or professional bio below to see how our AI categorizes your technical expertise.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input area */}
        <section className="space-y-4">
          <div className="relative group">
            <textarea
              className="w-full h-[400px] p-6 bg-dash-surface border border-dash-border rounded-2xl text-text-primary text-sm focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple outline-none transition-all resize-none shadow-inner"
              placeholder="Paste your resume content here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {!text && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40">
                <DocumentTextIcon className="size-12 mb-2 text-text-muted" />
                <span className="text-sm">Enter your text to begin</span>
              </div>
            )}
          </div>
          <PrimaryButton
            onClick={handleAnalyze}
            loading={mutation.isPending}
            classname="w-full py-4 text-lg font-semibold shadow-xl shadow-brand-purple/20"
          >
            Run AI Analysis
          </PrimaryButton>
        </section>

        {/* Results area */}
        <section className="bg-dash-surface border border-dash-border rounded-2xl p-6 relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            {!results ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20"
              >
                <div className="w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center">
                  <CpuChipIcon className="size-8 text-brand-purple/50" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">Awaiting Input</h3>
                  <p className="text-sm text-text-muted max-w-[240px] mt-1">
                    Your skills will be automatically categorized here after analysis.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-dash-border">
                  <h2 className="text-xl font-bold text-text-primary">Extraction Profile</h2>
                  <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircleIcon className="size-3" />
                    Verified Matches
                  </div>
                </div>

                <div className="grid gap-6">
                  <SkillCategory 
                    title="Languages" 
                    skills={results.languages} 
                    icon={<CodeBracketIcon className="size-4" />} 
                    color="text-blue-400" 
                  />
                  <SkillCategory 
                    title="Frameworks & Libs" 
                    skills={results.frameworks} 
                    icon={<CpuChipIcon className="size-4" />} 
                    color="text-purple-400" 
                  />
                  <SkillCategory 
                    title="Tools & Platforms" 
                    skills={results.tools} 
                    icon={<WrenchScrewdriverIcon className="size-4" />} 
                    color="text-orange-400" 
                  />
                  <SkillCategory 
                    title="Specializations" 
                    skills={results.technical} 
                    icon={<SparklesIcon className="size-4" />} 
                    color="text-emerald-400" 
                  />
                  <SkillCategory 
                    title="Soft Skills" 
                    skills={results.soft} 
                    icon={<UserIcon className="size-4" />} 
                    color="text-pink-400" 
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}

function SkillCategory({ title, skills, icon, color }: any) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${color}`}>
        {icon}
        {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill: string) => (
          <span 
            key={skill}
            className="px-3 py-1 bg-dash-base border border-dash-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-brand-purple/30 transition-colors cursor-default"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
