import { SurveySchema } from "@/actions/create_survey";
import { SiteHeader } from "@/components/dashboard/site-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { IconGraph, IconPencil } from "@tabler/icons-react";
import Link from "next/link";

export default async function Page() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("surveys").select();
  const surveys = data as SurveySchema[];

  return (
    <>
      <SiteHeader header="Surveys" />
      <div className="mx-auto lg:w-1/2 w-3/4">
        <h1 className="text-3xl font-bold my-3">Your surveys</h1>
        {surveys.map((s, i) => {
          return (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{s.title}</CardTitle>
                <CardDescription>{s.description}</CardDescription>
                <CardAction className="flex gap-x-3">
                  <Link href="#">
                    <Button
                      variant={"outline"}
                      className="rounded-md cursor-pointer"
                    >
                      <IconGraph />
                    </Button>
                  </Link>
                  <Link href="#">
                    <Button className="rounded-md cursor-pointer">
                      <IconPencil />
                    </Button>
                  </Link>
                </CardAction>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </>
  );
}
