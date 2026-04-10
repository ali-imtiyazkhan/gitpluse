"use client";

import { Terminal } from "lucide-react";
import React from "react";
import PrimaryButtom from "../ui/custom-button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CTA = () => {
  const router = useRouter();
  return (
    <div className="w-[94%] h-[420px] mt-2 mx-auto relative bg-transparent lg:bg-gradient-to-r from-white via-[#101010] to-white z-10 flex flex-col gap-6 items-center justify-center lg:p-[60px] rounded-3xl overflow-hidden">
      <Image
        src="/assets/ctagradient.svg"
        alt="cal"
        width={100}
        height={100}
        className="absolute inset-0 w-full h-full -z-10 object-cover rounded-3xl"
      />
      <div className="space-y-2 text-center">
        <h2 className="text-4xl text-[40px] w-full lg:text-7xl font-medium text-balance max-w-2xl tracking-tighter">
          Become the next pulse of Open Source
        </h2>
        <p className="tracking-tight lg:text-2xl font-light">
          Start contributing to projects that matter.
        </p>
      </div>
      <PrimaryButtom onClick={() => router.push("/dashboard/home")}>
        <Terminal />
        Get Started
      </PrimaryButtom>
    </div>
  );
};

export default CTA;
