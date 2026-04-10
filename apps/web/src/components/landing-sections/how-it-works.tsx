import { Sparkles, Users, Zap, LayoutGrid } from "lucide-react";
import Features from "../ui/features";
import Header from "../ui/header";

const data = [
    {
        id: 1,
        title: "1. Join the Pulse",
        content:
            "Create an account and apply to become a contributor. Our maintainers review applications to ensure a high-quality ecosystem.",
        image: "/assets/contribute.webp",
        icon: <Users className="w-6 h-6 text-brand-purple" />,
    },
    {
        id: 2,
        title: "2. Claim Your Impact",
        content:
            "Explore community projects and claim open tasks. Our real-time resource board ensures no two people work on the same task.",
        image: "/assets/search.webp",
        icon: <LayoutGrid className="w-6 h-6 text-brand-purple" />,
    },
    {
        id: 3,
        title: "3. Collaborate Live",
        content:
            "Watch the live pulse of the community. See task claims, project launches, and member approvals as they happen.",
        image: "/assets/filter.webp",
        icon: <Zap className="w-6 h-6 text-brand-purple" />,
    },
];

export default function HowItWorks() {
    return (
        <div id="HIW" className="border-b border-[#252525]">
            <Header title="How it Works"/>
            <div className="w-full relative px-[30px] lg:px-[50px]">
                <div
                    style={{
                        height: "100%",
                        "--pattern-fg": "#252525",
                        borderRight: "1px solid #252525",
                        backgroundImage:
                            "repeating-linear-gradient(315deg, #252525 0, #252525 1px, transparent 0, transparent 50%)",
                        backgroundSize: "10px 10px",
                        backgroundAttachment: "fixed",
                    } as React.CSSProperties}
                    className='w-[30px] lg:w-[50px] absolute left-0 top-0'
                />
                <div
                    style={{
                        height: "100%",
                        "--pattern-fg": "#252525",
                        borderLeft: "1px solid #252525",
                        backgroundImage:
                            "repeating-linear-gradient(315deg, #252525 0, #252525 1px, transparent 0, transparent 50%)",
                        backgroundSize: "10px 10px",
                        backgroundAttachment: "fixed",
                    } as React.CSSProperties}
                    className='w-[30px] lg:w-[50px] absolute right-0 top-0 '
                />
                <Features data={data} />
            </div>
        </div>
    );
}
