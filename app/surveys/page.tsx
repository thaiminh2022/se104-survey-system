"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { IconArrowRight, IconHome } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

export default function Page() {
  const [id, setId] = useState("");
  const router = useRouter();
  const surveyId = id.trim();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!surveyId) {
      return;
    }

    router.push(`/surveys/${encodeURIComponent(surveyId)}`);
  }

  return (
    <div className="grid min-h-screen w-full place-items-center bg-muted/20 px-4 py-6">
      <form className="w-full max-w-md" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Enter a survey</CardTitle>
          </CardHeader>

          <CardContent>
            <Field>
              <FieldLabel htmlFor="survey-id">Survey id</FieldLabel>
              <Input
                type="text"
                id="survey-id"
                className="rounded-sm"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Paste survey id"
                autoComplete="off"
              />
            </Field>
          </CardContent>

          <CardFooter className="gap-2">
            <Button type="submit" disabled={!surveyId}>
              Enter survey
              <IconArrowRight />
            </Button>

            <Button variant="secondary" type="button" asChild>
              <Link href={"/"}>
                <IconHome />
                Back to home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
