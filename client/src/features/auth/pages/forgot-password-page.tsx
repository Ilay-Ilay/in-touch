import ForgotPasswordForm from "../components/forgot-password-form";

type Props = {};

export default function ForgotPassword({}: Props) {
  return (
    <div className="p-4 flex h-screen items-center justify-center">
      <ForgotPasswordForm />
    </div>
  );
}
