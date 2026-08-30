import { useForm, Controller } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(2, "Name must be at least 2 characters."),

  email: z.string().email("Please enter a valid email address."),

  password: z.string().min(8, "Password must be at least 8 characters."),
});

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "#components/ui/field";
import { Input } from "#components/ui/input";
import { Button } from "#components/ui/button";
import { Link } from "react-router";
import { authClient } from "#lib/auth";
import { useState } from "react";
import { Spinner } from "#components/ui/spinner";
import { oAuth } from "../utils/oAuth";

type Props = {};

export default function SignUpForm({}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (isLoading) return;
    setIsLoading(true);
    const { error } = await authClient.signUp.email({
      username: data.username,

      email: data.email,

      password: data.password,

      name: data.username,
    });

    if (error) {
      setError("root", {
        message: error.message,
      });
      setIsLoading(false);
      return;
    }
  }

  return (
    <div className="w-full sm:max-w-md border border-border p-8 rounded-md">
      <div>
        <form
          id="sign-up-form"
          className="flex flex-col gap-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-2xl font-semibold text-center">Create account</h1>

          <FieldGroup>
            {errors.root && (
              <Field>
                <FieldError errors={[errors.root]} />
              </Field>
            )}
            <Controller
              name="username"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="username-input">Username</FieldLabel>
                    <Input
                      {...field}
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                      id="username-input"
                      placeholder="Username"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />
            <Controller
              name="email"
              control={control}
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />
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
          </FieldGroup>

          <div className="flex flex-col gap-4">
            <Button size="lg" type="submit" disabled={isLoading}>
              {isLoading && <Spinner />}

              {isLoading ? "Creating account..." : "Create account"}
            </Button>
            <span className="text-xs text-muted-foreground text-center">
              or
            </span>
            <Button size="lg" variant={"secondary"} onClick={() => oAuth()}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>{" "}
              Continue with Google
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground text-xs">
              Already have an account?
            </span>
            <Link
              to="/"
              className="text-xs text-primary underline-offset-4 hover:underline"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
