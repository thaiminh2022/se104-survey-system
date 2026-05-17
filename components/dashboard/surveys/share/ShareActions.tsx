"use client";

import { Button } from "@/components/ui/button";
import { IconLink } from "@tabler/icons-react";

interface Props {
  shareLink: string;
}

export default function ShareActions({ shareLink }: Props) {
  return (
    <>
      <Button
        onClick={async () => {
          await navigator.clipboard.write([
            new ClipboardItem({
              "text/plain": shareLink,
            }),
          ]);

          alert("link copied!");
        }}
      >
        <IconLink />
        Copy Link
      </Button>
    </>
  );
}
