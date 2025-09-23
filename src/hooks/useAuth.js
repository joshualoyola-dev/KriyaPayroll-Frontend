import { useEffect, useState } from "react";
import { loginUser } from "../services/auth.service";
import getErrorMessage, { getResponseErrorMessage } from "../utility/error.utility";
import { jwtDecode } from "jwt-decode";
import { useToastContext } from "../contexts/ToastProvider";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
    const [token, setToken] = useState(null);
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


            setToken(token);

            window.location.href = "/dashboard";
        } catch (error) {
            console.log('error: ', error);
            setError("Registration failed");
            addToast(getResponseErrorMessage(error), "error");
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');

        console.log('token: ', storedToken);

        if (storedToken) {
            setToken(storedToken);
        }

        setIsLoading(false);
    }, []);

    return {
        formData, setFormData,
        isLoading, setIsLoading,
        error, setError,
        handleLogin,
        token, setToken,
    }
};

export default useAuth;