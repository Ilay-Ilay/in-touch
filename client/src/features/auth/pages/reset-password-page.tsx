import ResetPasswordForm from "../components/reset-password-form";

type Props = {};

export default function ResetPassword({}: Props) {
  return (
    <div className="p-4 flex h-screen items-center justify-center">
      <ResetPasswordForm />
    </div>
  );
}
