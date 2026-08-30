import { useForm, Controller } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "#components/ui/field";
import { Input } from "#components/ui/input";
import { Button } from "#components/ui/button";
import { Spinner } from "#components/ui/spinner";
import { useState } from "react";
import { authClient } from "#lib/auth";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";

const formSchema = z

  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),

    confirm: z.string().min(8, "Password must be at least 8 characters."),
  })

  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match.",

    path: ["confirm"],
  });

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  if (!token) return <Navigate to="/" replace />;
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirm: "",
    },
  });

  const navigate = useNavigate();
  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (isLoading || !token) return;

    setIsLoading(true);

    const { error } = await authClient.resetPassword({
      newPassword: data.password,

      token,
    });

    if (error) {
      setError("root", {
        message: error.message,
      });

      setIsLoading(false);

      return;
    }

    navigate("/");
  }

  return (
    <form
      id="reset-password-form"
      className="flex flex-col gap-8 w-full sm:max-w-md border border-border p-8 rounded-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-2xl font-semibold">Reset password</h1>
      <FieldGroup>
        {errors.root && (
          <Field>
            <FieldError errors={[errors.root]} />
          </Field>
        )}

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password-input">Password</FieldLabel>
                <Input
                  type="password"
                  {...field}
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  id="password-input"
                  placeholder="Password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />
        <Controller
          name="confirm"
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="confirm-password-input">
                  Confirm password
                </FieldLabel>
                <Input
                  type="password"
                  {...field}
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  id="confirm-password-input"
                  placeholder="Confirm password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <div className="flex flex-col gap-4">
        <Button size="lg" type="submit" disabled={isLoading}>
          {isLoading && <Spinner />}

          {isLoading ? "Reseting..." : "Reset password"}
        </Button>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground text-xs">Back to login?</span>
          <Link
            to="/"
            className="text-xs text-primary underline-offset-4 hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </form>
  );
}
