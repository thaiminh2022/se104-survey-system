"use client";

import { SignUpForm } from "@/components/auth/sign-up-form";
import { useParams, useSearchParams } from "next/navigation";

export default function Page() {
  const params = useSearchParams();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm returnUrl={params.get("returnUrl")} />
      </div>
    </div>
  );
}
