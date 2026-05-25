import QrCodeView from "@/components/dashboard/surveys/share/QrCodeView";
import ShareActions from "@/components/dashboard/surveys/share/ShareActions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSiteUrl } from "@/lib/helper";
import { getSurveyById } from "@/lib/actions/read_survey";
import { IconQrcode, IconShare2 } from "@tabler/icons-react";

type Props = { params: Promise<{ id: string }> };

export default async function (props: Props) {
  const params = await props.params;
  const id = params.id;
  const qrValue = `${getSiteUrl()}/surveys/${id}`;
  const surveyResult = await getSurveyById(id);
  const allowedEmails = surveyResult.success
    ? (surveyResult.data.allowedRespondentEmails ?? [])
    : [];
  const isRestricted = allowedEmails.length > 0;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 lg:px-8">
      <header className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Survey distribution
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Share survey</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Send this link to respondents or download a QR code for printed
          material.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconShare2 className="size-5 text-muted-foreground" />
              <CardTitle>Share link</CardTitle>
            </div>
            <CardDescription>
              {isRestricted
                ? "Only signed-in respondents with an allowed email can open this survey."
                : "Anyone with this link can open the public survey page."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ShareActions shareLink={qrValue} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconQrcode className="size-5 text-muted-foreground" />
              <CardTitle>QR code</CardTitle>
            </div>
            <CardDescription>
              Useful for classrooms, events, posters, and offline sharing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QrCodeView value={qrValue} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
