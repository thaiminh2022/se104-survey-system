"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconX } from "@tabler/icons-react";

type Props = {
  options: string[];
  label?: string;
  onChange: (options: string[]) => void;
};

export function OptionListEditor({ options, label = "Option", onChange }: Props) {
  const values = options.length > 0 ? options : [`${label} 1`];

  return (
    <div className="space-y-3">
      {values.map((option, index) => (
        <div key={index} className="flex items-center gap-3">
          <Input
            value={option}
            onChange={(event) => {
              const next = [...values];
              next[index] = event.target.value;
              onChange(next);
            }}
            placeholder={`${label} ${index + 1}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={values.length <= 1}
            onClick={() => onChange(values.filter((_, i) => i !== index))}
          >
            <IconX className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="link"
        className="h-auto p-0"
        onClick={() => onChange([...values, `${label} ${values.length + 1}`])}
      >
        Add {label.toLowerCase()}
      </Button>
    </div>
  );
}
