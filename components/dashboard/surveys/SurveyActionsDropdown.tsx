"use client";

import ConfirmDialog from "@/components/dialog/confirm_dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteSurvey } from "@/lib/actions/read_survey";
import {
  IconChartArea,
  IconDotsVertical,
  IconPencil,
  IconShare,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";

type SurveyActionsDropdownProps = {
  surveyId: string;
};

export default function SurveyActionsDropdown({
  surveyId,
}: SurveyActionsDropdownProps) {
  async function handleDelete() {
    await deleteSurvey(surveyId);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label="Open survey actions"
        >
          <IconDotsVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/surveys/${surveyId}/edit`}>
            <IconPencil />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/analytics/${surveyId}`}>
            <IconChartArea />
            Analytics
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/surveys/${surveyId}/share`}>
            <IconShare />
            Share
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ConfirmDialog
          title="Delete survey?"
          description="This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={handleDelete}
        >
          <DropdownMenuItem
            variant="destructive"
            onSelect={(event) => event.preventDefault()}
          >
            <IconTrash />
            Delete
          </DropdownMenuItem>
        </ConfirmDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
