import Router from "./providers/Router";
import UIProvider from "./providers/UIProvider";

export default function App() {
  return (
    <UIProvider>
      <Router />
    </UIProvider>
  );
}
