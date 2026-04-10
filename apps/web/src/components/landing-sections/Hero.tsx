"use client";
import { Terminal } from "lucide-react";
import Image from "next/image";
import React from "react";
import PrimaryButtom from "../ui/custom-button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Hero = () => {
  const router = useRouter();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="w-full min-h-[50dvh] lg:h-[75dvh] relative overflow-hidden z-10 p-4 lg:p-[60px] flex flex-col items-center justify-center gap-6 ">
      <Image
        src="/assets/bgmain.svg"
        alt="background"
        fill
        className="object-cover max-md:object-top w-full h-full absolute -z-10 opacity-90"
        priority
      />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full h-max lg:max-w-3xl space-y-1 text-center"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-2 mb-4 [will-change:transform,opacity] motion-reduce:transition-none motion-reduce:transform-none"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-black/40 backdrop-blur-sm border border-[#252525] transition-colors">
            <span className="text-text-secondary text-sm font-medium">
              Join the Ecosystem
            </span>
          </div>
        </motion.div>
        <motion.h1
          variants={itemVariants}
          className="text-5xl text-[2.8rem] lg:text-7xl lg:text-[6rem] font-medium tracking-tighter [will-change:transform,opacity] motion-reduce:transition-none motion-reduce:transform-none"
        >
          The heartbeat of open source contribution
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
            type: "spring",
            delay: 0.1,
          }}
          className="w-full lg:text-2xl tracking-tight font-light sm:max-w-lg mx-auto lg:max-w-4xl lg:text-balance text-text-secondary"
        >
          Discover impact-driven projects, claim tasks in real-time, and build 
          your open-source legacy with a community that moves as fast as you do.
        </motion.p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
          delay: 0.3,
        }}
        className="cursor-pointer z-30 [will-change:transform,opacity] motion-reduce:transition-none motion-reduce:transform-none"
      >
        <PrimaryButtom onClick={() => router.push("/dashboard/home")}>
          <Terminal />
          Get Started
        </PrimaryButtom>
      </motion.div>
      <div className="absolute h-[50%] w-full bg-gradient-to-t from-surface-primary via-transparent to-transparent bottom-0 left-1/2 -translate-x-1/2"></div>
    </div>
  );
};

export default Hero;
