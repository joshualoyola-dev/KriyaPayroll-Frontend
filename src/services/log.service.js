import payroll_api from "../configs/payroll_api.config";

export const fetchPayrunLogs = async (payrun_id) => {
    return await payroll_api.get(`/api/v1/payruns/${payrun_id}/logs`);
};