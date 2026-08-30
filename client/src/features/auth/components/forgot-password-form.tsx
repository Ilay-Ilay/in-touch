import { useForm, Controller } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "#components/ui/field";
import { Input } from "#components/ui/input";
import { useState } from "react";
import { Button } from "#components/ui/button";
import { Spinner } from "#components/ui/spinner";
import { Link } from "react-router";
import { authClient } from "#lib/auth";

const formSchema = z.object({
  email: z

    .string()

    .email("Please enter a valid email address."),
});

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<null | string>(null);
  const { handleSubmit, control } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (isLoading) return;

    setIsLoading(true);

    const { data: responseData, error } = await authClient.requestPasswordReset(
      {
        email: data.email,

        redirectTo: `${import.meta.env.VITE_APP_URL}/reset-password`,
      },
    );

    if (responseData?.message) setMessage(responseData.message);
    setIsLoading(false);
  }

  return (
    <form
      id="forgot-password-form"
      className="flex flex-col gap-8 w-full sm:max-w-md border border-border p-8 rounded-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <h1 className="text-xl font-semibold">Forgot your password?</h1>
        <span className="text-xs text-muted-foreground">
          Enter your email and we'll send you a code to reset the password
        </span>
      </div>
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => {
          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email-input">Email</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id="email-input"
                placeholder="Email"
                type="email"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              {message && <FieldDescription>{message}</FieldDescription>}
            </Field>
          );
        }}
      />
      <Button size="lg" type="submit" disabled={isLoading}>
        {isLoading && <Spinner />}

        {isLoading ? "Sending..." : "Send reset code"}
      </Button>
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground text-sm">
          Already have an account?
        </span>
        <Link
          to="/"
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Login
        </Link>
      </div>
    </form>
  );
}
