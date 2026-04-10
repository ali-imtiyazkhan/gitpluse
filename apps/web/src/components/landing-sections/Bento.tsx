'use client'
import React from 'react'
import OrbitComponent from '../ui/orbit'
import CardStack from '../ui/card-stack'
import Image from 'next/image'
import { AnimatedList } from '../ui/animated-list'
import { cn } from '@/lib/utils'
import { Cap, Lucid, Mail0, SupMemory } from '../icons/icons'
import { motion } from 'framer-motion'
import Header from '../ui/header'
import { UserPlus, Zap, LayoutGrid, ClipboardCheck } from 'lucide-react'


let notifications = [
    {
        name: "New Member Joined!",
        description: "Ajeet just joined the community",
        icon: <UserPlus className="size-4 text-brand-purple" />,
        color: "#101010",
    },
    {
        name: "Task Claimed",
        description: "Task #104 was claimed by Rohan",
        icon: <ClipboardCheck className="size-4 text-brand-purple" />,
        color: "#fff",
    },
    {
        name: "New Project Live",
        description: "AI-Agents project is now active",
        icon: <LayoutGrid className="size-4 text-brand-purple" />,
        color: "#101010",
    },
    {
        name: "Real-time Sync",
        description: "Dashboard updated instantly",
        icon: <Zap className="size-4 text-brand-purple" />,
        color: "#fff",
    },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Bento = () => {
    return (
        <div id='features' className="flex flex-col w-full">
            <Header title="Your Gateway to Open Source Impact"/>
            <div className="w-full border-b border-[#252525] flex flex-col  lg:flex-row overflow-hidden">
                <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-r border-[#252525] lg:aspect-square relative overflow-hidden p-2 flex-shrink-0 space-y-1 h-[400px] lg:h-full ">
                    <div className="border border-dashed border-[#252525] w-full h-full  relative overflow-hidden p-[30px] flex-shrink-0 flex flex-col gap-4 lg:gap-0 ">
                        <div className="space-y-1 flex-shrink-0 z-10">
                            <motion.h5
                                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{ duration: 0.6, ease: 'easeOut', type: 'spring', delay: 0.35 }}
                                className='text-2xl lg:text-3xl tracking-tighter text-left'>Live Collaboration Pulses</motion.h5>
                            <motion.p
                                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{ duration: 0.6, ease: 'easeOut', type: 'spring', delay: 0.35 }}
                                className='tracking-tight text-sm lg:text-lg text-[#d1d1d1]'>Experience the heartbeat of the community in real-time.</motion.p>
                        </div>
                        <div className="h-full overflow-hidden w-full flex items-start lg:pt-10 lg:pb-4  relative z-10">
                            <AnimatedList className='w-full'>
                                {notifications.map((item, idx) => (
                                    <Notification {...item} key={idx} />
                                ))}
                            </AnimatedList>
                        </div>

                        <div className="absolute w-full h-full top-0 left-0">
                            <Image
                                src="/assets/mask.svg"
                                alt="background"
                                fill
                                className="object-cover w-full h-full opacity-60 "
                            />
                        </div>

                        <div className="absolute h-full w-full bg-gradient-to-t from-[#101010]/75 via-transparent to-[#101010]/75 top-0 left-1/2 -translate-x-1/2"></div>
                        <div className="absolute h-full w-full bg-gradient-to-r from-[#101010]/75 via-transparent to-[#101010]/75 top-0 left-1/2 -translate-x-1/2"></div>
                        <div className="h-[90px] absolute left-1/2 -translate-x-1/2 -bottom-7 w-full bg-[#101010] blur-[15px] z-20"></div>
                    </div>
                </div>
                <div className="border-b lg:border-b-0 lg:border-r border-[#252525] lg:w-1/3 lg:aspect-square relative overflow-hidden p-2 flex-shrink-0 space-y-1 h-[400px] lg:h-full">
                    <div className="border border-dashed border-[#252525] w-full h-full relative overflow-hidden p-[30px] flex-shrink-0 space-y-1 flex flex-col items-center justify-start gap-4 z-10">
                        <div className="w-full z-10">
                            <motion.h5
                                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{ duration: 0.6, ease: 'easeOut', type: 'spring', delay: 0.35 }}
                                className='text-2xl lg:text-3xl tracking-tighter text-left'>Verified Contributor Tiers</motion.h5>
                            <motion.p
                                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{ duration: 0.6, ease: 'easeOut', type: 'spring', delay: 0.35 }}
                                className='tracking-tight text-sm lg:text-lg text-[#d1d1d1]'>Quality-driven applications and role-based access.</motion.p>
                        </div>
                        <div className="absolute w-full h-full top-0 left-0">
                            <div className="absolute h-full w-full z-10"></div>

                            <Image
                                src="/assets/mask.svg"
                                alt="background"
                                fill
                                className="object-cover w-full h-full opacity-60 "
                            />
                        </div>
                        <div className="absolute h-full w-full bg-gradient-to-t from-[#101010]/75 via-transparent to-[#101010]/75 top-0 left-1/2 -translate-x-1/2"></div>
                        <div className="absolute h-full w-full bg-gradient-to-r from-[#101010]/75 via-transparent to-[#101010]/75 top-0 left-1/2 -translate-x-1/2"></div>
                        <div className="lg:translate-y-16 translate-y-5">
                            <OrbitComponent />
                        </div>
                        <div className="h-[90px] absolute -bottom-10 w-full bg-[#101010] blur-[15px]"></div>
                    </div>
                </div>
                <div className="lg:w-1/3 lg:aspect-square relative overflow-hidden p-2 flex-shrink-0 space-y-1 h-[400px] lg:h-full">
                    <div className="border border-dashed border-[#252525] w-full h-full relative overflow-hidden p-[30px] flex-shrink-0 flex flex-col gap-4 lg:gap-0 ">
                        <div className="space-y-1 flex-shrink-0 z-10">
                            <motion.h5
                                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{ duration: 0.6, ease: 'easeOut', type: 'spring', delay: 0.35 }}
                                className='text-2xl lg:text-3xl tracking-tighter text-left'>Mission Control</motion.h5>
                            <motion.p
                                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{ duration: 0.6, ease: 'easeOut', type: 'spring', delay: 0.35 }}
                                className='tracking-tight text-sm lg:text-lg text-[#d1d1d1]'>Manage mission-critical tasks with Kanban precision.</motion.p>
                        </div>
                        <div className="h-full w-full flex items-center lg:pt-10 lg:pb-4  relative overflow-hidden z-20">
                            <CardStack />
                        </div>

                        <div className="absolute w-full h-full top-0 left-0">
                            <div className="absolute h-full w-full   z-10"></div>

                            <Image
                                src="/assets/mask.svg"
                                alt="background"
                                fill
                                className="object-cover w-full h-full opacity-60 "
                            />
                        </div>
                        <div className="absolute h-full w-full bg-gradient-to-t from-[#101010]/75 via-transparent to-[#101010]/75 top-0 left-1/2 -translate-x-1/2"></div>
                        <div className="absolute h-full w-full bg-gradient-to-r from-[#101010]/75 via-transparent to-[#101010]/75 top-0 left-1/2 -translate-x-1/2"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Bento


const Notification = ({ name, description, icon, color, time }: any) => {
    return (
        <figure
            className={cn(
                "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
                "transition-all duration-200 ease-in-out hover:scale-[103%]",
                "transform-gpu bg-transparent backdrop-blur-md [border:1px_solid_rgba(255,255,255,.1)] [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <div
                    className="flex size-10 items-center justify-center rounded-2xl overflow-hidden relative"
                    style={{
                        backgroundColor: color,
                    }}
                >
                    <span className="text-lg w-10 lg:aspect-square flex items-center justify-center">{icon}</span>
                </div>
                <div className="flex flex-col overflow-hidden">
                    <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium text-white ">
                        <span className="text-sm sm:text-lg">{name}</span>
                        <span className="text-xs text-gray-500">{time}</span>
                    </figcaption>
                    <p className="text-sm font-normal text-white/60">
                        {description}
                    </p>
                </div>
            </div>
        </figure>
    );
};