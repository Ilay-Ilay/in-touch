import React from "react";
import SignUpForm from "../components/sign-up-form";

type Props = {};

export default function SignUp({}: Props) {
  return (
    <div className="p-4 flex h-screen items-center justify-center">
      <SignUpForm />
    </div>
  );
}
