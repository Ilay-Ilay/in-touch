import { authClient } from "#lib/auth";
import { Navigate, Outlet } from "react-router";
import FullScreenLoader from "../fullscreen-loader";
import { SidebarInset, SidebarProvider } from "../sidebar";
import { AppSidebar } from "#components/sidebar/app-sidebar";

export default function Protected() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <FullScreenLoader />;
  }
  if (!session) {
    return <Navigate to="/" replace />;
  }
  console.log({ session, isPending });
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
