import { SiteHeader } from "@/components/dashboard/site-header";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";

export default function Page() {
  return (
    <>
      <SiteHeader header="Surveys" />
      <Field orientation="horizontal" className="max-w-sm">
        <FieldContent>
          <FieldLabel htmlFor="switch-focus-mode">
            Share across devices
          </FieldLabel>
          <FieldDescription>
            Focus is shared across devices, and turns off when you leave the
            app.
          </FieldDescription>
        </FieldContent>
      </Field>
    </>
  );
}
