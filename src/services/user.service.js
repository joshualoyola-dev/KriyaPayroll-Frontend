import env from "../configs/env.config";
import hris_api from "../configs/hris_api.config";
import payroll_api from "../configs/payroll_api.config";

export const getUser = async () => {
    return await hris_api.get("/api/hris-user-accounts/user/me/basic-info");
}

export const getPayrollUsers = async () => {
    return await hris_api.get(`/api/hris-user-accounts/users-payroll/${env.VITE_PAYROLL_SERVICE_ID}`)
}

export const getCompanyAccessToken = async () => {
    const response = await payroll_api.get(`/api/v1/managements/me`);

    return response.data;
};