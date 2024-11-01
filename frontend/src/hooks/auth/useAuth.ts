import { useNavigate } from "react-router-dom";
import paths from "@/configs/paths";

const useAuth = () => {
    const navigate = useNavigate();

    const goSignupPage = () => {
        navigate(paths.auth.signUp)
    }

    const goSignInPage = () => {
        navigate(paths.auth.signIn)
    }

    return {
        goSignupPage,
        goSignInPage
    }
}

export default useAuth;