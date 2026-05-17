import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function LoginForm({
  error,
  message,
  returnUrl,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  error?: string;
  message?: string;
  returnUrl: string;
}) {
  const registerHref = `/auth/register?${new URLSearchParams({ returnUrl }).toString()}`;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={login}>
            <input type="hidden" name="returnUrl" value={returnUrl} />
            <FieldGroup>
              {message ? (
                <FieldDescription className="rounded-md border border-border bg-muted px-3 py-2">
                  {message}
                </FieldDescription>
              ) : null}
              {error ? <FieldError>{error}</FieldError> : null}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" type="password" name="password" required />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href={registerHref}>Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
