import SurveyEntryForm from "@/components/surveys/SurveyEntryForm";
import { Button } from "@/components/ui/button";
import { logoutAndReturn } from "@/lib/actions/auth";
import { getUserData } from "@/lib/actions/read_user";
import { IconLogout } from "@tabler/icons-react";

export default async function Page() {
  const userResult = await getUserData();
  const signedInEmail = userResult.success ? userResult.data.email : null;

  return (
    <div className="grid min-h-screen w-full place-items-center bg-muted/20 px-4 py-6">
      <div className="w-full max-w-md space-y-3">
        {signedInEmail ? (
          <div className="flex flex-wrap items-center justify-end gap-2 text-sm text-muted-foreground">
            <span className="min-w-0 truncate">Signed in as {signedInEmail}</span>
            <form action={logoutAndReturn}>
              <input type="hidden" name="returnUrl" value="/surveys" />
              <Button type="submit" variant="outline">
                <IconLogout />
                Log out
              </Button>
            </form>
          </div>
        ) : null}
        <SurveyEntryForm />
      </div>
    </div>
  );
}
