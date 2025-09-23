import { useState } from "react";
import { loginUser } from "../services/auth.service";
import getErrorMessage, { getResponseErrorMessage } from "../utility/error.utility";
import { jwtDecode } from "jwt-decode";
import { useToastContext } from "../contexts/ToastProvider";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
    const [formData, setFormData] = useState({
        user_email: '',
        password: '',
        service: 'PAYROLL',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const { addToast } = useToastContext();
    const navigate = useNavigate();

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const response = await loginUser(formData);
            const { token } = response.data;
            //decode the token
            const decoded = jwtDecode(token);
            localStorage.setItem("system_user_id", decoded.system_user_id);
            localStorage.setItem('token', token);
            // window.location.href = "/dashboard";
            // navigate('/dashboard', { replace: true });
            navigate("/dashboard");
            window.location.reload();
        } catch (error) {
            console.log('error: ', error);
            setError("Registration failed");
            addToast(getResponseErrorMessage(error), "error");
        }
        finally {
            setIsLoading(false);
        }
    };

    return {
        formData, setFormData,
        isLoading, setIsLoading,
        error, setError,
        handleLogin,
    }
};

export default useAuth;