import { Suspense } from "react";
import SignUpPage from "@/components/login/SignUpPage";

export default function SignUp() {
  return (
    <div className="flex flex-col h-screen w-full justify-center items-center relative bg-surface-primary">
      <div className=" z-10">
        <Suspense fallback={<div>Loading...</div>}>
          <SignUpPage />
        </Suspense>
      </div>
    </div>
  );
}
