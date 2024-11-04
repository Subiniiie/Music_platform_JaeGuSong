import paths from "../configs/paths";
import mainRoute from "./main-route";
import MainLayout from "../layouts/main-layout";
import { Navigate, createBrowserRouter } from "react-router-dom";
import AuthLayout from "@/layouts/auth-layout";
import SignInView from "@/pages/auth/signin-view";
import SignUpView from "@/pages/auth/signup-view";
import NavbarLayout from "@/layouts/navbar-layout";
import TitleLayout from "@/layouts/title-layout";
import titleRoute from "./title-route";

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
        // errorElement: <Navigate to={paths.main} replace />,
        children: [
          {
            element: <TitleLayout />,
            children: titleRoute,
          },
          {
            children: mainRoute,
          },
        ],
      },
    ],
  },
]);

export default router;
