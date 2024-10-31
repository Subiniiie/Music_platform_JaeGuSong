import paths from "../configs/paths";
import mainRoute from "./main-route";
import MainLayout from "../layouts/main-layout";
import { Navigate, createBrowserRouter } from "react-router-dom";
import AuthLayout from "@/layouts/auth-layout";
import SignInView from "@/pages/auth/signin-view";
import SignUpView from "@/pages/auth/signup-view";
import NavbarLayout from "@/layouts/navbar-layout";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: paths.auth.signIn,
            element: <SignInView />,
          },
          {
            path: paths.auth.signUp,
            element: <SignUpView />,
          },
        ],
      },
      {
        element: <NavbarLayout />,
        children: mainRoute,
        errorElement: <Navigate to={paths.main} replace />,
      },
    ],
  },
]);

export default router;
