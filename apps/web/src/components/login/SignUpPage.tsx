"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import PrimaryButton from "../ui/custom-button";
import Image from "next/image";
import Overlay from "../ui/overlay";
import Link from "next/link";

const SignUpPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const signupMutation = trpc.auth.signup.useMutation({
    onSuccess: () => {
      toast.success("Account created successfully! Please login.");
      setIsLoading(false);
      router.push("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    signupMutation.mutate({ email, password, firstName });
  };

  return (
    <div className="font-semibold flex flex-col items-center gap-6 font-sans w-[550px] relative overflow-hidden py-16 px-10 border border-[#252525] rounded-3xl bg-[#101010]">
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
          Create an account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-[380px] flex flex-col gap-4 z-20">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-400">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#555] transition-colors"
            placeholder="John Doe"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-400">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#555] transition-colors"
            placeholder="john@example.com"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-400">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#555] transition-colors"
            placeholder="••••••••"
            required
          />
        </div>
        
        <PrimaryButton
          type="submit"
          loading={isLoading}
          classname="w-full mt-2"
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </PrimaryButton>
      </form>

      <p className="text-gray-400 text-sm z-20">
        Already have an account?{" "}
        <Link href="/login" className="text-white hover:underline cursor-pointer">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default SignUpPage;
