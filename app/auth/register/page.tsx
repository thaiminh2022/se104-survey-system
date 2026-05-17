import { RegisterForm } from "@/components/auth/register-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    error?: string;
    returnUrl?: string;
  }>;
};

function getReturnUrl(returnUrl?: string) {
  if (!returnUrl || !returnUrl.startsWith("/") || returnUrl.startsWith("//")) {
    return "/dashboard";
  }

  return returnUrl;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const returnUrl = getReturnUrl(params.returnUrl);
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect(returnUrl);
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm error={params.error} returnUrl={returnUrl} />
      </div>
    </div>
  );
}
