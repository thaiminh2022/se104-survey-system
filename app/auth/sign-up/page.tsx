import { SignUpForm } from "@/components/auth/sign-up-form";
import { sanitizeReturnUrl } from "@/lib/auth/return-url";

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
        <SignUpForm returnUrl={returnUrl} />
      </div>
    </div>
  );
}
