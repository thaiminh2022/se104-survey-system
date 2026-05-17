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
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [id, setId] = useState("");
  return (
    <div className="min-h-screen w-full grid place-items-center px-4">
      <form className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Enter a survey via id</CardTitle>
          </CardHeader>

          <CardContent>
            <Field>
              <FieldLabel htmlFor="survey-id">Enter survey id</FieldLabel>
              <Input
                type="text"
                id="survey-id"
                className="rounded-sm"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </Field>
          </CardContent>

          <CardFooter className="gap-2">
            <Link href={`/surveys/${id}`}>
              <Button type="button" className="cursor-pointer">
                Enter survey
              </Button>
            </Link>

            <Link href={"/"}>
              <Button
                variant="secondary"
                type="button"
                className="cursor-pointer"
              >
                Back to home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
