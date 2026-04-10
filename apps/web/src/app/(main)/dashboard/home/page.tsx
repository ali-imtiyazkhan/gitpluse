"use client";
import React from "react";
import { useEffect } from "react";
import { useProjectTitleStore } from "@/store/useProjectTitleStore";
import MembershipBanner from "@/components/dashboard/MembershipBanner";
import LiveActivityFeed from "@/components/dashboard/LiveActivityFeed";
import { useSession } from "next-auth/react";

const Home = () => {
  const { setProjectTitle } = useProjectTitleStore();
  const { data: session } = useSession();

  useEffect(() => {
    setProjectTitle("Pulse Dashboard");
  }, [setProjectTitle]);

  return (
    <div className="flex flex-col gap-6">
      <MembershipBanner />
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Left: Stats & Overview */}
        <div className="xl:col-span-1 flex flex-col gap-6">
            <div className="p-6 rounded-2xl bg-dash-surface border border-dash-border flex flex-col justify-between h-36">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Community Status</span>
                <span className={`text-2xl font-bold ${
                    (session?.user as any)?.status === "APPROVED" ? "text-green-500" : 
                    (session?.user as any)?.status === "PENDING" ? "text-yellow-500" : "text-text-primary"
                }`}>
                    {(session?.user as any)?.status || "GUEST"}
                </span>
            </div>
            <div className="p-6 rounded-2xl bg-dash-surface border border-dash-border flex flex-col justify-between h-36">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Your Role</span>
                <span className="text-2xl font-bold text-brand-purple italic">
                    {(session?.user as any)?.role || "GUEST"}
                </span>
            </div>
        </div>

        {/* Right: Real-time Feed */}
        <div className="xl:col-span-3">
            <LiveActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default Home;
