import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "../features/auth/pages/Login";
import SignUp from "../features/auth/pages/SignUp";
import Public from "#components/ui/layout/Public";
import Protected from "#components/ui/layout/Protected";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Public />,
    children: [
      { index: true, element: <Login /> },
      { path: "/sign_up", element: <SignUp /> },
    ],
  },
  {
    element: <Protected />,
    children: [],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
