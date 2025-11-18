import payroll_api from "../configs/payroll_api.config";


// Daily records
export const fetchDailyRecordsCount = async (from, to, is_active = false) => {
    return await payroll_api.get(`/api/v1/daily-records/OCBPO/analytics/counts?from=${from}&to=${to}&is_active=${is_active}`);
};