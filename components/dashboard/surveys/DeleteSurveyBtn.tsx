"use client";

import { IconTrash } from "@tabler/icons-react";
import ConfirmDialog from "../../dialog/confirm_dialog";
import { Button } from "../../ui/button";
import { deleteSurvey } from "@/lib/actions/read_survey";

type DeleteSurveyButtonProps = {
  surveyId: string;
};

export default function DeleteSurveyButton({
  surveyId,
}: DeleteSurveyButtonProps) {
  async function handleDelete() {
    await deleteSurvey(surveyId);
  }

  return (
    <ConfirmDialog
      title="Delete survey?"
      description="This action cannot be undone."
      confirmText={"Delete"}
      cancelText="Cancel"
      variant="destructive"
      onConfirm={handleDelete}
    >
      <Button
        type="button"
        variant="destructive"
        className="rounded-md cursor-pointer"
      >
        <IconTrash />
      </Button>
    </ConfirmDialog>
  );
}
