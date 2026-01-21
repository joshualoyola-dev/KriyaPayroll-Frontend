import axios from "axios";
import env from "./env.config";
import { forceLogout } from "../utility/auth.utility";

const hris_api = axios.create({
    baseURL: env.VITE_HRIS_BACKEND_URL,
    withCredentials: false,
});

hris_api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

hris_api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403) {
            forceLogout();
        }
        return Promise.reject(error);
    }
);

export default hris_api;