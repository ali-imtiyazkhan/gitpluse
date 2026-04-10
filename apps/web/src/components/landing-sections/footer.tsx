"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Twitter, Github } from "../icons/icons";

const Footer = () => {
  const footerLinks = [
    {
      title: "Platform",
      links: [
        { name: "Dashboard", href: "/dashboard/home" },
        { name: "Projects", href: "/dashboard/projects" },
        { name: "GitHub", href: "https://github.com/ali-imtiyazkhan" },
      ],
    },
    {
      title: "Community",
      links: [
        { name: "Twitter", href: "" },
        { name: "Support", href: "" },
      ],
    },
  ];

  return (
    <footer
      id="Contact"
      className="border-x lg:border-x-2 border-t lg:border-t-2 border-[#252525] mt-2 mx-auto w-[98%] px-4 lg:px-10 pt-8 lg:pt-16 pb-4 lg:pb-8 bg-[#101010]"
    >
      <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/logo.svg"
              alt="logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-2xl font-medium tracking-tighter text-white">
              GitPulse
            </span>
          </div>
          <p className="text-[#b1b1b1] text-base lg:text-lg tracking-tight max-w-xs">
            The heartbeat of open source contribution.
          </p>
          <div className="flex gap-4 mt-2">
            <Link
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[#252525] hover:bg-brand-purple/20 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </Link>
            <Link
              href="https://github.com/ali-imtiyazkhan"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[#252525] hover:bg-brand-purple/20 transition-colors"
            >
              <Github className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-12 lg:gap-24">
          {footerLinks.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="text-white font-medium">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      href={link.href}
                      className="text-[#b1b1b1] hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#252525] gap-4">
        <p className="text-[#b1b1b1] text-sm tracking-tight text-center md:text-left">
          © {new Date().getFullYear()} GitPulse. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link href="#" className="text-[#b1b1b1] hover:text-white text-xs">Privacy Policy</Link>
          <Link href="#" className="text-[#b1b1b1] hover:text-white text-xs">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
