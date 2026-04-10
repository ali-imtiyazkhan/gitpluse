"use client";
import React from "react";
import { useEffect } from "react";
import { useProjectTitleStore } from "@/store/useProjectTitleStore";
import MembershipBanner from "@/components/dashboard/MembershipBanner";
import LiveActivityFeed from "@/components/dashboard/LiveActivityFeed";
import QuickStats from "@/components/dashboard/QuickStats";
import FeaturedRepos from "@/components/dashboard/FeaturedRepos";
import { useSession } from "next-auth/react";

const Home = () => {
  const { setProjectTitle } = useProjectTitleStore();
  const { data: session } = useSession();

  useEffect(() => {
    setProjectTitle("Pulse Dashboard");
  }, [setProjectTitle]);

  return (
    <div className="flex flex-col gap-8 p-6 xl:p-8 max-w-[1600px] mx-auto">
      {/* Welcome Banner */}
      <MembershipBanner />

      {/* Quick Stats Row */}
      <QuickStats />
      
      {/* Main Content Grid: Featured Repos + Activity Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left: Featured Repositories (wider) */}
        <div className="xl:col-span-2">
          <FeaturedRepos />
        </div>

        {/* Right: Live Activity Feed */}
        <div className="xl:col-span-1">
          <LiveActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default Home;
