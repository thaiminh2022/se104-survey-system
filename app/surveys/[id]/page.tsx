import SurveyResponseForm from "@/components/surveys/SurveyResponseForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getFakeSurveyById,
  getPublishedSurveyById,
} from "@/lib/actions/read_survey";
import { logout, logoutAndReturn } from "@/lib/actions/auth";
import { getUserData } from "@/lib/actions/read_user";
import { ActionState } from "@/lib/types/errors";
import { Survey } from "@/lib/types/question-type";
import { IconFileReport, IconLogout, IconSwitchHorizontal } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function Page(props: Props) {
  const params = await props.params;
  const id = params.id;
  const userResult = await getUserData();
  const signedInEmail = userResult.success ? userResult.data.email : null;
  let surveyRes: ActionState<Survey>;

  if (id === "test") {
    surveyRes = await getFakeSurveyById(id);
  } else {
    surveyRes = await getPublishedSurveyById(id);
  }

  if (!surveyRes.success) {
    if (surveyRes.message === "Authentication required for this survey.") {
      const params = new URLSearchParams({ returnUrl: `/surveys/${id}` });
      redirect(`/auth/login?${params.toString()}`);
    }

    if (surveyRes.message === "You are not allowed to view this survey.") {
      return (
        <SurveyAccessDenied
          surveyId={id}
          signedInEmail={signedInEmail}
        />
      );
    }

    return (
      <>
        <SurveyAccountBar signedInEmail={signedInEmail} returnUrl={`/surveys/${id}`} />
        <p className="mt-6 text-sm text-muted-foreground">
          Cannot fetch survey: {surveyRes.message}
        </p>
      </>
    );
  }
  const survey = surveyRes.data;
  if (survey.state == "draft" || survey.state == "archived") {
    return (
      <SurveyAccessDenied surveyId={id} signedInEmail={signedInEmail} />
    );
  }
  return (
    <>
      <SurveyAccountBar signedInEmail={signedInEmail} returnUrl={`/surveys/${id}`} />
      <SurveyTitle title={survey.title} description={survey.description} />
      <SurveyResponseForm survey={survey} />
    </>
  );
}

function SurveyAccessDenied({
  surveyId,
  signedInEmail,
}: {
  surveyId: string;
  signedInEmail: string | null;
}) {
  const returnUrl = `/surveys/${surveyId}`;

  return (
    <main className="grid min-h-[70svh] place-items-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Account not allowed</CardTitle>
          <CardDescription>
            This survey is restricted to specific respondent emails.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {signedInEmail ? (
            <p className="text-sm text-muted-foreground">
              You are signed in as{" "}
              <span className="font-medium text-foreground">{signedInEmail}</span>.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Sign in with an allowed account to continue.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <form action={logoutAndReturn}>
            <input type="hidden" name="returnUrl" value={returnUrl} />
            <Button type="submit">
              <IconSwitchHorizontal />
              Change account
            </Button>
          </form>
          {signedInEmail ? (
            <form action={logout}>
              <Button type="submit" variant="outline">
                <IconLogout />
                Log out
              </Button>
            </form>
          ) : null}
        </CardFooter>
      </Card>
    </main>
  );
}

function SurveyAccountBar({
  signedInEmail,
  returnUrl,
}: {
  signedInEmail: string | null;
  returnUrl: string;
}) {
  if (!signedInEmail) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap items-center justify-end gap-2 text-sm text-muted-foreground">
      <span className="min-w-0 truncate">Signed in as {signedInEmail}</span>
      <form action={logoutAndReturn}>
        <input type="hidden" name="returnUrl" value={returnUrl} />
        <Button type="submit" variant="outline">
          <IconLogout />
          Log out
        </Button>
      </form>
    </div>
  );
}

function SurveyTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="mt-3">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>

        <CardAction>
          <Link href="#">
            <Button variant={"destructive"}>
              <IconFileReport />
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
