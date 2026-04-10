"use client";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import PrimaryButton from "../ui/custom-button";
import { Google, Github } from "../icons/icons";
import Image from "next/image";
import Overlay from "../ui/overlay";
import Link from "next/link";

const SignInPage = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard/home";

  const getSafeCallbackUrl = (url: string): string => {
    if (!url || url.trim() === "") {
      return "/dashboard/home";
    }

    if (url.startsWith("/") && !url.startsWith("//")) {
      return url;
    }

    try {
      const parsedUrl = new URL(url, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
      if (parsedUrl.origin === (typeof window !== "undefined" ? window.location.origin : "")) {
        return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
      }
    } catch {}

    return "/dashboard/home";
  };

  const safeCallbackUrl = getSafeCallbackUrl(callbackUrl);

  const handleSignIn = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: safeCallbackUrl });
  };

  return (
    <div className="font-semibold flex flex-col items-center gap-6 font-sans w-[550px] relative overflow-hidden py-20 px-10 border border-[#252525] rounded-3xl bg-[#101010]">
      <Overlay />
      <Image
        src="/assets/mask.svg"
        alt="background"
        fill
        className="object-cover w-full h-full opacity-60 scale-150"
      />
      <div className="flex items-center justify-center flex-col text-[#f5f5f5] gap-4 z-20">
        <div className="w-16 aspect-square overflow-hidden relative">
          <Image
            src="/assets/logo_var2.svg"
            alt="background"
            fill
            className="object-cover rounded-2xl w-full h-full"
          />
        </div>
        <p className="tracking-tighter font-semibold text-2xl leading-tight">
          Welcome to GitPulse
        </p>
      </div>
      <PrimaryButton
        onClick={() => handleSignIn("google")}
        classname="w-full max-w-[380px] z-20 "
      >
        <div className="w-6">
          <Google />
        </div>
        Continue with Google
      </PrimaryButton>
      <PrimaryButton
        onClick={() => handleSignIn("github")}
        classname="w-full max-w-[380px] z-20 "
      >
        <div className="w-6">
          <Github />
        </div>
        Continue with GitHub
      </PrimaryButton>

      <div className="w-full max-w-[380px] flex items-center gap-4 z-20 my-2">
        <div className="h-[1px] bg-[#252525] flex-1"></div>
        <span className="text-gray-500 text-sm">OR</span>
        <div className="h-[1px] bg-[#252525] flex-1"></div>
      </div>

      <form 
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const email = formData.get("email") as string;
          const password = formData.get("password") as string;
          signIn("credentials", { email, password, callbackUrl: safeCallbackUrl });
        }}
        className="w-full max-w-[380px] flex flex-col gap-4 z-20"
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-400">Email Address</label>
          <input
            name="email"
            type="email"
            className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#555] transition-colors"
            placeholder="john@example.com"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-400">Password</label>
          <input
            name="password"
            type="password"
            className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#555] transition-colors"
            placeholder="••••••••"
            required
          />
        </div>
        
        <PrimaryButton
          type="submit"
          classname="w-full mt-2"
        >
          Sign In
        </PrimaryButton>
      </form>

      <p className="text-gray-400 text-sm z-20">
        Don't have an account?{" "}
        <Link href="/signup" className="text-white hover:underline cursor-pointer">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default SignInPage;
