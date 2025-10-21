import env from "../configs/env.config";
import hris_api from "../configs/hris_api.config";

export const getUser = async () => {
    return await hris_api.get("/api/hris-user-accounts/user/me/basic-info");
}

export const getPayrollUsers = async () => {
    console.log('service id of payroll: ', env.VITE_PAYROLL_SERVICE_ID);

    return await hris_api.get(`/api/hris-user-accounts/users-payroll/${env.VITE_PAYROLL_SERVICE_ID}`)
}

