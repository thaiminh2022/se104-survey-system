"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconCopy, IconExternalLink } from "@tabler/icons-react";
import Link from "next/link";
import { toast } from "sonner";

interface Props {
  shareLink: string;
}

export default function ShareActions({ shareLink }: Props) {
  async function copyLink() {
    await navigator.clipboard.writeText(shareLink);
    toast.success("Survey link copied");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input readOnly value={shareLink} className="font-mono" />
        <Button type="button" onClick={copyLink}>
          <IconCopy />
          Copy
        </Button>
      </div>
      <Button asChild variant="outline">
        <Link href={shareLink} target="_blank" rel="noreferrer">
          <IconExternalLink />
          Open public page
        </Link>
      </Button>
    </div>
  );
}
