import { Field, FieldLabel } from "../ui/field";
import { Switch } from "../ui/switch";

interface ToggleDescriptionProps {
  setCheck: (state: boolean) => void;
  check: boolean;
}
export function ToggleDescription({ check, setCheck }: ToggleDescriptionProps) {
  return (
    <Field orientation={"horizontal"}>
      <Switch
        id="show-desc"
        onCheckedChange={(e) => setCheck(e)}
        checked={check}
      />
      <FieldLabel htmlFor="show-desc">Show description</FieldLabel>
    </Field>
  );
}
