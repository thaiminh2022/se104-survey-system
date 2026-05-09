import { SiteHeader } from "@/components/dashboard/site-header";
import QrCodeView from "@/components/dashboard/surveys/share/QrCodeView";
import ShareActions from "@/components/dashboard/surveys/share/ShareActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSiteUrl } from "@/lib/helper";

type Props = { params: Promise<{ id: string }> };

export default async function (props: Props) {
  const params = await props.params;
  const id = params.id;
  const qrValue = `${getSiteUrl()}/surveys/${id}`;

  return (
    <>
      <SiteHeader header="Share" />
      <div className="mx-auto lg:w-1/2 w-3/4 flex flex-col gap-y-5">
        <h1 className="text-3xl font-bold my-3">Share</h1>
        <Card>
          <CardHeader>
            <CardTitle>QRCode</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <QrCodeView value={qrValue} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ShareActions shareLink={qrValue} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
