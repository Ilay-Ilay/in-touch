import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Login from "../features/auth/pages/login-page";
import SignUp from "../features/auth/pages/sign-up-page";

import Chat from "../features/chat/pages/chat-page";

import ForgotPassword from "../features/auth/pages/forgot-password-page";
import ResetPassword from "../features/auth/pages/reset-password-page";
import Public from "#components/ui/layout/public";
import Protected from "#components/ui/layout/protected";

const router = createBrowserRouter([
  {
    path: "/",

    element: <Public />,

    children: [
      { index: true, element: <Login /> },

      { path: "sign-up", element: <SignUp /> },

      { path: "forgot-password", element: <ForgotPassword /> },

      { path: "reset-password", element: <ResetPassword /> },
    ],
  },

  {
    element: <Protected />,

    children: [{ path: "chat", element: <Chat /> }],
  },

  {
    path: "*",

    element: <Navigate to="/" replace />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
