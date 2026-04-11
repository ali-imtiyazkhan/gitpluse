"use client";

import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/ui/custom-button";
import { 
  DocumentTextIcon, 
  SparklesIcon, 
  CheckCircleIcon,
  XCircleIcon,
  CpuChipIcon,
  CodeBracketIcon,
  WrenchScrewdriverIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumeAnalyzerPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: suggestions, refetch: refetchSuggestions } = trpc.project.getSuggested.useQuery(undefined, {
    enabled: !!results,
  });

  const mutation = trpc.member.analyzeSkills.useMutation({
    onMutate: () => {
      console.log("🚀 Mutation: analyzeSkills triggered");
      setError(null);
    },
    onSuccess: (data) => {
      console.log("✅ Mutation: analyzeSkills success", data);
      setResults(data);
      refetchSuggestions();
      toast.success("Analysis complete!", {
        description: "Your profile has been updated and we've found some project matches.",
      });
    },
    onError: (err) => {
      console.error("❌ Mutation: analyzeSkills error", err);
      setError(err.message);
      toast.error("Analysis failed", {
        description: err.message,
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast.error("Please upload a PDF file.");
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileData(reader.result as string);
        setText(""); // Clear text if file is uploaded
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = () => {
    console.log("🔍 Analyze button clicked!");
    if (!text.trim() && !fileData) {
      console.log("❌ Validation failed: No text or file data");
      toast.error("Please paste your resume or upload a PDF first.");
      return;
    }
    
    console.log("🚀 Calling tRPC analyzeSkills mutation...");
    mutation.mutate({ 
      text: text || undefined,
      fileData: fileData || undefined,
      fileType: file?.type || undefined
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-dash-base">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
          <SparklesIcon className="size-8 text-brand-purple" />
          AI Resume Analyzer 2.0
        </h1>
        <p className="text-text-secondary mt-2">
          Upload your PDF resume or paste your bio. Our LLM-powered engine will match you with the best projects.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input area */}
        <section className="lg:col-span-5 space-y-4">
          <div className="flex flex-col gap-4">
            {/* PDF Upload Zone */}
            <div className={`relative group border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center text-center ${
              file ? "border-brand-purple bg-brand-purple/5" : "border-dash-border bg-dash-surface hover:border-brand-purple/30"
            }`}>
              <input 
                type="file" 
                accept=".pdf" 
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                onChange={handleFileChange}
              />
              <div className="space-y-2 pointer-events-none">
                <div className={`size-12 rounded-xl mx-auto flex items-center justify-center ${file ? "bg-brand-purple text-white" : "bg-dash-base text-text-muted"}`}>
                  <DocumentTextIcon className="size-6" />
                </div>
                {file ? (
                  <div>
                    <p className="text-sm font-bold text-text-primary">{file.name}</p>
                    <p className="text-[10px] text-brand-purple uppercase font-bold mt-1">Ready for analysis</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-text-primary group-hover:text-brand-purple transition-colors">Click to upload PDF</p>
                    <p className="text-xs text-text-muted mt-1">Max size: 5MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-grow bg-dash-border" />
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">OR</span>
              <div className="h-px flex-grow bg-dash-border" />
            </div>

            {/* Text Area */}
            <div className="relative group">
              <textarea
                className="w-full h-[240px] p-6 bg-dash-surface border border-dash-border rounded-2xl text-text-primary text-sm focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple outline-none transition-all resize-none shadow-inner"
                placeholder="Or paste your professional bio here..."
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setFile(null);
                  setFileData(null);
                }}
              />
            </div>
          </div>

          <PrimaryButton
            onClick={handleAnalyze}
            loading={mutation.isPending}
            classname="w-full py-4 text-lg font-semibold shadow-xl shadow-brand-purple/20"
          >
            {mutation.isPending ? "Analyzing with AI..." : "Extract Skills & Match"}
          </PrimaryButton>
        </section>

        {/* Results area */}
        <section className="lg:col-span-7 flex flex-col gap-8">
          <div className="bg-dash-surface border border-dash-border rounded-2xl p-6 relative overflow-hidden min-h-[400px]">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20"
                >
                  <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center">
                    <XCircleIcon className="size-8 text-rose-500/50" />
                  </div>
                  <div className="max-w-xs">
                    <h3 className="text-lg font-semibold text-text-primary">Analysis Error</h3>
                    <p className="text-sm text-rose-500/80 mt-1 font-medium italic">
                      {error}
                    </p>
                    <PrimaryButton 
                      onClick={handleAnalyze} 
                      classname="mt-6 py-2 px-6 text-xs h-auto bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white"
                    >
                      Try Again
                    </PrimaryButton>
                  </div>
                </motion.div>
              ) : !results ? (
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Project Suggestions */}
          {results && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dash-surface border border-dash-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-3">
                  <SparklesIcon className="size-6 text-brand-purple" />
                  AI Suggested Projects
                </h2>
                <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Based on your Pulse Profile</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {suggestions?.map((project: any) => (
                  <div key={project.id} className="p-4 rounded-xl bg-dash-base border border-dash-border hover:border-brand-purple/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-dash-surface flex items-center justify-center border border-dash-border text-brand-purple font-bold text-lg">
                        {project.name?.[0]}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-text-primary group-hover:text-brand-purple transition-colors">{project.name}</h3>
                        <p className="text-xs text-text-muted mt-0.5 max-w-[300px] truncate">{project.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-tighter">Pulse Match</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-dash-surface rounded-full overflow-hidden border border-dash-border">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${project.matchScore || 0}%` }}
                              className="h-full bg-brand-purple"
                            />
                          </div>
                          <span className="text-xs font-bold text-brand-purple">{project.matchScore || 0}%</span>
                        </div>
                      </div>
                      <PrimaryButton 
                        onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                        classname="py-2 px-4 text-xs whitespace-nowrap"
                      >
                        View Project
                      </PrimaryButton>
                    </div>
                  </div>
                ))}
                {(!suggestions || suggestions.length === 0) && (
                   <div className="py-8 text-center text-text-muted text-sm italic">No matching projects found yet. Try expanding your resume!</div>
                )}
              </div>
            </motion.div>
          )}
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
