import { jwtDecode } from "jwt-decode";


export const getToken = () => {

    const hris_token = localStorage.getItem("token");
    const payroll_token = localStorage.getItem("companyAccessToken");


    return {
        hris_token, payroll_token
    }
}

export const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const { exp } = jwtDecode(token);
        return Date.now() >= exp * 1000;
    } catch (error) {
        return true;
    }
}

export const removeLocalVariables = () => {
    localStorage.clear();
    return;
}

export const forceLogout = () => {
    localStorage.clear();
    window.location.href = "/auth/login";
};