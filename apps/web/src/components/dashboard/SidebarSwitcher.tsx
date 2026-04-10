"use client";

import { useShowSidebar } from "@/store/useShowSidebar";
import { HomeIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

export default function SidebarSwitcher() {
  const { activeSidebar, setActiveSidebar } = useShowSidebar();

  const NAV_ITEMS = [
    {
      id: "general",
      icon: <HomeIcon className="size-5" />,
      label: "General",
    },
    {
      id: "community",
      icon: <UserGroupIcon className="size-5" />,
      label: "Community",
    },
  ] as const;

  return (
    <div className="w-[64px] h-screen bg-dash-surface border-r border-dash-border flex flex-col items-center py-6 gap-6 z-50">
      <div className="flex flex-col gap-4">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSidebar(item.id)}
            title={item.label}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative group",
              activeSidebar === item.id
                ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20"
                : "text-text-muted hover:text-text-primary hover:bg-dash-hover"
            )}
          >
            {item.icon}
            {activeSidebar === item.id && (
              <div className="absolute left-0 w-1 h-5 bg-white rounded-r-full" />
            )}
            <div className="absolute left-full ml-3 px-2 py-1 bg-black text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-dash-border">
              {item.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
