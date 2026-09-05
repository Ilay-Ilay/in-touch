import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./providers/Router";
import UIProvider from "./providers/UIProvider";
import { SocketProvider } from "./providers/SocketProvider";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <UIProvider>
          <Router />
        </UIProvider>
      </SocketProvider>
    </QueryClientProvider>
  );
}
