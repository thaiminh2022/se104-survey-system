"use client";

import { useMemo, useState } from "react";
import { IconLock, IconPlus, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSurveyStore } from "@/lib/stores/survey_store";
import { isValidEmail, normalizeEmail, normalizeEmailList } from "@/lib/helper";

export default function SurveyAccessCard() {
  const survey = useSurveyStore((s) => s.survey);
  const updateAllowedRespondentEmails = useSurveyStore(
    (s) => s.updateAllowedRespondentEmails,
  );
  const [email, setEmail] = useState("");
  const allowedEmails = useMemo(
    () => normalizeEmailList(survey.allowedRespondentEmails),
    [survey.allowedRespondentEmails],
  );

  function addEmail() {
    const normalized = normalizeEmail(email);

    if (!isValidEmail(normalized)) {
      toast.error("Enter a valid email address.");
      return;
    }

    if (allowedEmails.includes(normalized)) {
      toast.error("That email is already allowed.");
      return;
    }

    updateAllowedRespondentEmails([...allowedEmails, normalized]);
    setEmail("");
  }

  function removeEmail(emailToRemove: string) {
    updateAllowedRespondentEmails(
      allowedEmails.filter((item) => item !== emailToRemove),
    );
  }

  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <IconLock className="size-4" />
          Access
        </CardTitle>
        <CardDescription>
          Leave the list empty for a public survey. Add emails to require
          respondents to sign in with one of those addresses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel>Allowed respondent emails</FieldLabel>
            <div className="flex gap-2">
              <Input
                type="email"
                value={email}
                placeholder="student@example.com"
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addEmail();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="shrink-0 rounded-md"
                onClick={addEmail}
              >
                <IconPlus />
                Add
              </Button>
            </div>
          </Field>

          {allowedEmails.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {allowedEmails.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="gap-1 rounded-md py-1 pl-2 pr-1"
                >
                  {item}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-5 rounded-sm"
                    aria-label={`Remove ${item}`}
                    onClick={() => removeEmail(item)}
                  >
                    <IconTrash className="size-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Public: anyone with the published survey link can respond.
            </p>
          )}
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
