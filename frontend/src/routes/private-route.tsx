import React, { Children } from "react";
import { Navigate } from "react-router-dom";
import paths from "@/configs/paths";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const storedToken = localStorage.getItem('jwtToken');

    if (!storedToken) {
        return <Navigate to={paths.auth.signIn}></Navigate>
    }

    return <>{children}</>;
};

export default PrivateRoute;