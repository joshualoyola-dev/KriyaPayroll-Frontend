import payroll_api from "../configs/payroll_api.config";

export const fetchYearToDate = async (company_id, date_start, date_end) => {
    return await payroll_api.get(`/api/v1/data-exports/company/${company_id}/ytds?date_start=${date_start}&date_end=${date_end}`);
};