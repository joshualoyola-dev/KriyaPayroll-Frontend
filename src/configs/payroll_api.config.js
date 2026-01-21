import axios from "axios";
import env from "./env.config";
import { forceLogout } from "../utility/auth.utility";

const payroll_api = axios.create({
    baseURL: env.VITE_PAYROLL_BACKEND_URL,
    withCredentials: false,
});

payroll_api.interceptors.request.use((config) => {
    // HRIS auth token
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Payroll company access token
    const companyAccessToken = localStorage.getItem('companyAccessToken');
    if (companyAccessToken) {
        config.headers['x-company-access-token'] = companyAccessToken;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});


payroll_api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 403) {
            forceLogout();
        }

        return Promise.reject(error);
    }
);

export default payroll_api;
