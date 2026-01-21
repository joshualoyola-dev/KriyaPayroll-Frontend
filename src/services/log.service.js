import payroll_api from "../configs/payroll_api.config";

export const fetchPayrunLogs = async (company_id, payrun_id) => {
    return await payroll_api.get(`/api/v1/payruns/${company_id}/${payrun_id}/logs`);
};