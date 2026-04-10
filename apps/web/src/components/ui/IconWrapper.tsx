"use client"

import { cn } from "@/lib/utils"
import React from "react";

interface IconWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const IconWrapper = ({ children, className, ...props }: IconWrapperProps) => {
    return (
        <div
            className={cn(
                "h-[28px] w-[28px] p-0.5 rounded-sm border border-ox-gray cursor-pointer flex justify-center items-center",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}