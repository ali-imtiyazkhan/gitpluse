"use client";

import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import PrimaryButtom from "../ui/custom-button";

const MembershipBanner = () => {
  const { data: session, update: updateSession } = useSession();
  const applyMutation = trpc.member.joinCommunity.useMutation({
    onSuccess: () => {
      toast.success("Application submitted!", {
        description: "An admin will review your request soon.",
      });
      updateSession();
    },
    onError: (error) => {
      toast.error("Failed to submit application", {
        description: error.message,
      });
    },
  });

  const status = (session?.user as any)?.status;

  if (status === "APPROVED" || status === "BANNED") return null;

  return (
    <div className="w-full p-6 rounded-2xl bg-gradient-to-r from-brand-purple/20 via-brand-purple/5 to-transparent border border-brand-purple/20 flex flex-col lg:flex-row items-center justify-between gap-6 mb-8 overflow-hidden relative group">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-purple/10 rounded-full blur-3xl group-hover:bg-brand-purple/20 transition-colors duration-500"></div>
      
      <div className="flex items-start gap-4 z-10">
        <div className="p-3 rounded-xl bg-brand-purple/10 border border-brand-purple/20">
          <Sparkles className="size-6 text-brand-purple" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary tracking-tight">
            {status === "PENDING" ? "Application Pending" : "Join the Community"}
          </h2>
          <p className="text-sm text-text-secondary max-w-md mt-1">
            {status === "PENDING" 
              ? "Your application is currently under review. Once approved, you'll be able to claim tasks and contribute to projects." 
              : "Become a contributor to claim tasks, collaborate on projects, and grow your open-source impact."}
          </p>
        </div>
      </div>

      <div className="z-10 w-full lg:w-auto">
        {status !== "PENDING" && (
          <PrimaryButtom 
            onClick={() => applyMutation.mutate()}
            loading={applyMutation.isPending}
            classname="w-full lg:w-auto"
          >
            Apply to Join
          </PrimaryButtom>
        )}
        {status === "PENDING" && (
          <div className="px-4 py-2 rounded-lg bg-black/40 border border-dash-border text-xs font-medium text-text-muted">
            Waiting for approval...
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipBanner;
