import { useCallback, useEffect, useState } from "react";
import { loginUser } from "../services/auth.service";
import getErrorMessage, { getResponseErrorMessage } from "../utility/error.utility";
import { jwtDecode } from "jwt-decode";
import { useToastContext } from "../contexts/ToastProvider";
import { useNavigate } from "react-router-dom";
import { getCompanyAccessToken } from "../services/user.service";

const useAuth = () => {
    const [token, setToken] = useState(null);
    const [companyAccessToken, setCompanyAccessToken] = useState(null);

    const [formData, setFormData] = useState({
        user_email: '',
        password: '',
        service: 'PAYROLL',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const { addToast } = useToastContext();
    const navigate = useNavigate();

    const handleLogin = useCallback(async () => {
        setIsLoading(true);
        try {
            //fetch token from hris
            const response = await loginUser(formData);
            const { token } = response.data;

            const decoded = jwtDecode(token);

            localStorage.setItem("system_user_id", decoded.system_user_id);
            localStorage.setItem("service_features_access", JSON.stringify(decoded.accessPermissions))
            localStorage.setItem('token', token);

            setToken(token);

            // fetch token from payroll
            const { data: companyToken } = await getCompanyAccessToken();

            setCompanyAccessToken(companyToken);

            localStorage.setItem('companyAccessToken', companyToken);

            navigate('/dashboard');
        } catch (error) {
            console.log('error: ', error);
            setError("Login failed");
            addToast(getResponseErrorMessage(error), "error");
        }
        finally {
            setIsLoading(false);
        }
    }, [formData, navigate, addToast]);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedCompanyAccessToken = localStorage.getItem('companyAccessToken');
        if (storedToken) {
            setToken(storedToken);
        }

        if (storedCompanyAccessToken) {
            setCompanyAccessToken(storedCompanyAccessToken);
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