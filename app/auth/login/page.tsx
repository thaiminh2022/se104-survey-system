import { LoginForm } from "@/components/auth/login-form";
import { sanitizeReturnUrl } from "@/lib/auth/return-url";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{
    returnUrl?: string | string[];
  }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const rawReturnUrl = Array.isArray(params.returnUrl)
    ? params.returnUrl[0]
    : params.returnUrl;
  const returnUrl = sanitizeReturnUrl(rawReturnUrl);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<>Loading</>}>
          <LoginForm returnUrl={returnUrl} />
        </Suspense>
      </div>
    </div>
  );
}
