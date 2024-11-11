import { useState } from "react";
import { useNavigate } from "react-router-dom";
import paths from "@/configs/paths";
import { AsyncLocalStorage } from "async_hooks";
import UseSingnin from "./useSignin";

const useAuth = () => {
    const [ token, setToken ] = useState<string>('');
    const { setSignined } = UseSingnin();
    const [ mySeq, setMySeq ] = useState<Number>(0);
    const navigate = useNavigate();

    const goSignupPage = () => {
        navigate(paths.auth.signUp)
    };

    const goSignInPage = () => {
        navigate(paths.auth.signIn)
    };
    
    const goLogout = () => {
        setSignined(false)
        localStorage.removeItem('jwtToken');
        navigate(paths.auth.signIn)
    };

    const getStoredToken = (): string | null => {
        const storedToken = localStorage.getItem('jwtToken');
        if (storedToken) {
            setToken(storedToken);
        }
        return storedToken;
    };

    return {
        token,
        mySeq,
        goSignupPage,
        goSignInPage,
        goLogout,
        getStoredToken,
        setMySeq
    }
};

export default useAuth;