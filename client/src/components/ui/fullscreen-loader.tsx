import { Spinner } from "./spinner";

type Props = {};

export default function FullScreenLoader({}: Props) {
  return (
    <div className="h-screen flex items-center justify-center">
      <Spinner className="size-8" />
    </div>
  );
}
