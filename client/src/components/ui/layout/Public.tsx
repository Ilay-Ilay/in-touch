import { authClient } from "#lib/auth";
import { Navigate, Outlet } from "react-router";
import FullScreenLoader from "../fullscreen-loader";

export default function Public() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <FullScreenLoader />;
  }

  if (session) {
    return <Navigate to="/chat" replace />;
  }

  return <Outlet />;
}
