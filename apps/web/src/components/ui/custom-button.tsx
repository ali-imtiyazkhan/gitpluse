"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type React from "react";

const PrimaryButton = ({
  children,
  animate = true,
  classname,
  onClick,
  loading = false,
  disabled = false,
  type = "button",
}: {
  children: React.ReactNode;
  animate?: boolean;
  classname?: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) => {
  const transition = {
    duration: 0.1,
    ease: "easeInOut",
  };
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={cn(
        "flex gap-2 items-center justify-center px-5 py-3 rounded-[16px] relative",
        "border-x border-t-2 border-brand-purple",
        "bg-gradient-to-b from-[#5728f4] to-[#5100FF]",
        "[box-shadow:0px_-2px_0px_0px_#2c04b1_inset]",
        "hover:opacity-90 transition-opacity duration-100",
        "text-white font-medium",
        (loading || disabled) && "opacity-70 cursor-not-allowed",
        classname
      )}
      transition={animate ? transition : undefined}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Please wait...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default PrimaryButton;
