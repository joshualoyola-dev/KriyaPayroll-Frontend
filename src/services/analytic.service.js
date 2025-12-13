import payroll_api from "../configs/payroll_api.config";


// Daily records
export const fetchDailyRecordsCount = async (from, to, is_active = false, company_id) => {
    return await payroll_api.get(`/api/v1/daily-records/${company_id}/analytics/counts?from=${from}&to=${to}&is_active=${is_active}`);
};